import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  AlarmClock,
  ClipboardCheck,
  ClipboardList,
  Code,
  File,
  FileText,
  HelpCircle,
  Link as LinkIcon,
  Music,
  Video,
  type LucideIcon,
} from "lucide-react";
import { Navigate, useNavigate, useParams } from "react-router";
import { useCourses } from "../context/CourseContext";
import { ItemViewer } from "./ItemViewer";

const itemTypeIcons: Record<string, LucideIcon> = {
  pdf: FileText,
  video: Video,
  audio: Music,
  scorm: FileText,
  file: File,
  heading: FileText,
  text: FileText,
  link: LinkIcon,
  quiz: HelpCircle,
  livetest: AlarmClock,
  liveclass: Video,
  assignment: ClipboardList,
  coding: Code,
  form: ClipboardCheck,
};

export function CoursePlayerView() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { courses, loading } = useCourses();
  const course = courses.find((c) => c.id === Number(courseId));

  const [activeChapterId, setActiveChapterId] = useState<number | null>(null);
  const [activeItemId, setActiveItemId] = useState<number | null>(null);
  const [completedIds, setCompletedIds] = useState<number[]>([]);
  const [expandedChapters, setExpandedChapters] = useState<number[]>([]);

  const allItems = useMemo(() => course?.chapters.flatMap((ch) => ch.items) ?? [], [course]);

  useEffect(() => {
    if (!course) return;
    const first = course.chapters[0];
    setActiveChapterId(first?.id ?? null);
    setActiveItemId(first?.items[0]?.id ?? null);
    setCompletedIds([]);
    setExpandedChapters(course.chapters.map((ch) => ch.id));
  }, [course?.id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-sm text-[#6B7280]">Loading course...</div>
      </div>
    );
  }

  if (!course) return <Navigate to="/courses" replace />;

  const activeItem = activeItemId != null ? allItems.find((it) => it.id === activeItemId) : undefined;
  const activeIndex = activeItem ? allItems.findIndex((it) => it.id === activeItem.id) : -1;
  const isComplete = activeItem ? completedIds.includes(activeItem.id) : false;
  const progress = allItems.length ? Math.round((completedIds.length / allItems.length) * 100) : 0;

  const toggleComplete = (id: number) => {
    setCompletedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const goToIndex = (index: number) => {
    const item = allItems[index];
    if (!item) return;
    const chapter = course.chapters.find((ch) => ch.items.some((it) => it.id === item.id));
    if (chapter) setActiveChapterId(chapter.id);
    setActiveItemId(item.id);
  };

  const toggleChapter = (id: number) => {
    setExpandedChapters((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Sidebar */}
      <aside className="flex w-80 shrink-0 flex-col border-r border-neutral-200 bg-white">
        <div className="flex items-center gap-3 border-b border-neutral-200 px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 shrink-0 items-center justify-center text-neutral-700 hover:bg-neutral-50"
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-neutral-900">{course.title}</div>
            <div className="text-xs text-neutral-500">User preview</div>
          </div>
        </div>

        <div className="grow overflow-y-auto">
          {course.chapters.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-[#6B7280]">
              This course has no content yet.
            </div>
          ) : (
            <div className="space-y-2 p-4">
              {course.chapters.map((chapter, chapterIndex) => {
                const isExpanded = expandedChapters.includes(chapter.id);
                const isActive = chapter.id === activeChapterId;
                const chapterComplete = chapter.items.length > 0 && chapter.items.every((it) => completedIds.includes(it.id));
                return (
                  <div key={chapter.id}>
                    <button
                      onClick={() => toggleChapter(chapter.id)}
                      className={`flex w-full items-center gap-2 px-3 py-2.5 text-left ${isActive ? "bg-neutral-100" : "hover:bg-neutral-50"}`}
                    >
                      <ChevronDown
                        size={14}
                        className={`shrink-0 text-neutral-400 transition-transform ${isExpanded ? "" : "-rotate-90"}`}
                      />
                      <span className={`truncate text-sm font-medium ${isActive ? "text-neutral-900" : "text-neutral-700"}`}>
                        {chapter.title}
                      </span>
                      {chapterComplete && (
                        <CheckCircle2 size={14} className="ml-auto shrink-0 text-emerald-500" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="mt-1 space-y-0.5 pl-6">
                        {chapter.items.map((item) => {
                          const Icon = itemTypeIcons[item.type] ?? FileText;
                          const isItemActive = item.id === activeItemId;
                          const done = completedIds.includes(item.id);
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                setActiveChapterId(chapter.id);
                                setActiveItemId(item.id);
                              }}
                              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs ${isItemActive ? "bg-neutral-100" : "hover:bg-neutral-50"}`}
                            >
                              <Icon
                                size={13}
                                className={`shrink-0 ${isItemActive ? "text-neutral-900" : "text-neutral-400"}`}
                              />
                              <span className={`truncate ${isItemActive ? "font-semibold text-neutral-900" : "text-neutral-500"}`}>
                                {item.title}
                              </span>
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleComplete(item.id);
                                }}
                                className="ml-auto shrink-0 cursor-pointer text-neutral-400 hover:text-neutral-700"
                                title={done ? "Mark incomplete" : "Mark complete"}
                              >
                                {done ? (
                                  <CheckCircle2 size={15} className="text-emerald-500" />
                                ) : (
                                  <Circle size={15} />
                                )}
                              </span>
                            </button>
                          );
                        })}
                        {chapter.items.length === 0 && (
                          <div className="px-3 py-1 text-xs text-neutral-400">No items</div>
                        )}
                      </div>
                    )}
                    {chapterIndex < course.chapters.length - 1 && (
                      <div className="mx-3 my-2 border-t border-neutral-200" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex min-w-0 grow flex-col">
        {/* Progress bar */}
        <div className="flex items-center gap-4 border-b border-neutral-200 bg-white px-8 py-3">
          <div className="flex-grow">
            <div className="mb-1 flex items-center justify-between text-xs text-neutral-500">
              <span>
                {completedIds.length} of {allItems.length} items completed
              </span>
              <span className="text-neutral-700 font-medium">{progress}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden bg-neutral-200">
              <div
                className="h-full bg-neutral-900 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          {activeItem && (
            <button
              onClick={() => toggleComplete(activeItem.id)}
              className={`flex shrink-0 items-center gap-2 px-4 py-2 text-sm font-medium ${isComplete
                  ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                  : "bg-neutral-900 text-white hover:bg-neutral-800"
              }`}
            >
              <CheckCircle2 size={16} />
              {isComplete ? "Mark incomplete" : "Mark as complete"}
            </button>
          )}
        </div>

        {/* Item content */}
        <div className="grow overflow-y-auto p-8">
          {activeItem ? (
            <div className="mx-auto h-full w-full max-w-5xl border border-neutral-200 bg-white p-8">
              <ItemViewer key={activeItem.id} item={activeItem} />
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <FileText size={48} className="text-neutral-400" />
              <div className="text-lg font-semibold text-neutral-900">Select an item to begin</div>
              <p className="max-w-md text-sm text-neutral-500">
                Choose a chapter item from the sidebar to view its content.
              </p>
            </div>
          )}
        </div>

        {/* Prev / Next */}
        {allItems.length > 0 && (
          <div className="flex items-center justify-between border-t border-neutral-200 bg-white px-8 py-3">
            <button
              onClick={() => goToIndex(activeIndex - 1)}
              disabled={activeIndex <= 0}
              className="flex items-center gap-1.5 border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <span className="text-sm text-neutral-500">
              {activeIndex + 1} / {allItems.length}
            </span>
            <button
              onClick={() => goToIndex(activeIndex + 1)}
              disabled={activeIndex >= allItems.length - 1}
              className="flex items-center gap-1.5 bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
