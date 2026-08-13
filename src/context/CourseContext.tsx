import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { ItemType } from "../components/ItemModal";
import { courseApi } from "../api/courses";

export type FileMeta = {
  name: string;
  size: number;
  type: string;
};

export type QuizOption = {
  id: string;
  text: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation?: string;
};

export type CourseItem = {
  id: number;
  title: string;
  type: ItemType;
  description?: string;
  url?: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  fileMeta?: FileMeta;
  fileData?: string;
  quizQuestions?: QuizQuestion[];
};

export type CourseChapter = {
  id: number;
  title: string;
  items: CourseItem[];
};

export type CoursePricing = {
  planType: "FREE" | "ONE_TIME";
  mrp?: string;
  price?: string;
  passFees?: boolean;
};

export type Course = {
  id: number;
  title: string;
  description: string;
  pricing: CoursePricing;
  chapters: CourseChapter[];
  createdAt: number;
  updatedAt?: number;
  cover?: string;
  tags?: string;
  instructor?: string;
  tagline?: string;
  language?: string;
  category?: string;
  featuredPriority?: number;
  taxRate?: string;
  courseUrl?: string;
  canonicalUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  showValidity?: boolean;
  accessChannels?: string[];
  offlineUsage?: boolean;
  showCurriculumInfo?: boolean;
  allowBookmarks?: boolean;
  welcomeEmailEnabled?: boolean;
  welcomeEmailSubject?: string;
  welcomeEmailContent?: string;
};

type CourseDraft = {
  title: string;
  description: string;
  pricing: CoursePricing;
  chapters: CourseChapter[];
  cover?: string;
};

type CourseContextValue = {
  courses: Course[];
  loading: boolean;
  draft: CourseDraft;
  editingCourseId: number | null;
  updateDraft: (partial: Partial<CourseDraft>) => void;
  addChapter: (chapter: CourseChapter) => void;
  updateChapterItems: (chapterId: number, items: CourseItem[]) => void;
  deleteChapterItem: (chapterId: number, itemId: number) => void;
  saveCourse: () => Promise<number | null>;
  deleteCourse: (id: number) => Promise<void>;
  updateCourse: (id: number, partial: Partial<Course>) => Promise<void>;
  startEditCourse: (id: number) => void;
  startNewCourse: () => void;
  resetDraft: () => void;
};

const emptyDraft: CourseDraft = {
  title: "",
  description: "",
  pricing: { planType: "ONE_TIME", mrp: "", price: "", passFees: true },
  chapters: [],
};

const CourseContext = createContext<CourseContextValue | null>(null);

export function CourseProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<CourseDraft>(emptyDraft);
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    courseApi
      .list()
      .then((data) => {
        if (!cancelled) setCourses(data);
      })
      .catch((err) => console.error("Failed to load courses", err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const updateDraft = useCallback((partial: Partial<CourseDraft>) => {
    setDraft((prev) => ({ ...prev, ...partial }));
  }, []);

  const addChapter = useCallback((chapter: CourseChapter) => {
    setDraft((prev) => ({ ...prev, chapters: [...prev.chapters, chapter] }));
  }, []);

  const updateChapterItems = useCallback((chapterId: number, items: CourseItem[]) => {
    setDraft((prev) => ({
      ...prev,
      chapters: prev.chapters.map((ch) => (ch.id === chapterId ? { ...ch, items } : ch)),
    }));
  }, []);

  const deleteChapterItem = useCallback((chapterId: number, itemId: number) => {
    setDraft((prev) => ({
      ...prev,
      chapters: prev.chapters.map((ch) =>
        ch.id === chapterId ? { ...ch, items: ch.items.filter((it) => it.id !== itemId) } : ch
      ),
    }));
  }, []);

  const saveCourse = useCallback(async (): Promise<number | null> => {
    if (!draft.title.trim()) return null;
    const payload = {
      title: draft.title,
      description: draft.description,
      pricing: draft.pricing,
      chapters: draft.chapters,
      ...(draft.cover ? { cover: draft.cover } : {}),
    };
    try {
      if (editingCourseId != null) {
        const updated = await courseApi.update(editingCourseId, payload);
        setCourses((prev) => prev.map((c) => (c.id === editingCourseId ? updated : c)));
        setDraft(emptyDraft);
        setEditingCourseId(null);
        return updated.id;
      }
      const created = await courseApi.create(payload);
      setCourses((prev) => [created, ...prev]);
      setDraft(emptyDraft);
      setEditingCourseId(null);
      return created.id;
    } catch (err) {
      console.error("Failed to save course", err);
      return null;
    }
  }, [draft, editingCourseId]);

  const deleteCourse = useCallback(async (id: number) => {
    try {
      await courseApi.remove(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Failed to delete course", err);
    }
  }, []);

  const updateCourse = useCallback(async (id: number, partial: Partial<Course>) => {
    try {
      const updated = await courseApi.partialUpdate(id, partial);
      setCourses((prev) => prev.map((c) => (c.id === id ? updated : c)));
    } catch (err) {
      console.error("Failed to update course", err);
    }
  }, []);

  const startEditCourse = useCallback(
    (id: number) => {
      const course = courses.find((c) => c.id === id);
      if (!course) return;
      setDraft({
        title: course.title,
        description: course.description,
        pricing: course.pricing,
        chapters: course.chapters,
        cover: course.cover,
      });
      setEditingCourseId(id);
    },
    [courses]
  );

  const startNewCourse = useCallback(() => {
    setDraft(emptyDraft);
    setEditingCourseId(null);
  }, []);

  const resetDraft = useCallback(() => {
    setDraft(emptyDraft);
    setEditingCourseId(null);
  }, []);

  const value = useMemo(
    () => ({
      courses,
      loading,
      draft,
      editingCourseId,
      updateDraft,
      addChapter,
      updateChapterItems,
      deleteChapterItem,
      saveCourse,
      deleteCourse,
      updateCourse,
      startEditCourse,
      startNewCourse,
      resetDraft,
    }),
    [
      courses,
      loading,
      draft,
      editingCourseId,
      updateDraft,
      addChapter,
      updateChapterItems,
      deleteChapterItem,
      saveCourse,
      deleteCourse,
      updateCourse,
      startEditCourse,
      startNewCourse,
      resetDraft,
    ]
  );

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
}

export function useCourses() {
  const ctx = useContext(CourseContext);
  if (!ctx) throw new Error("useCourses must be used within CourseProvider");
  return ctx;
}
