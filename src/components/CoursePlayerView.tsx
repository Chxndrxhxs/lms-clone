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
    <div className="flex h-screen bg-[#F8F9FA]">
      {/* Sidebar */}
      <aside className="flex w-80 shrink-0 flex-col border-r border-[#ECEEEF] bg-white">
        <div className="flex items-center gap-3 border-b border-[#ECEEEF] px-4 py-4">
          <button
            onClick={() => navigate(`/courses/${course.id}`)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#4E5DE0] hover:bg-[#F7F9FA]"
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-[#0F1013]">{course.title}</div>
            <div className="text-xs text-[#6B7280]">User preview</div>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto">
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
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left ${
                        isActive ? "bg-[#F2F4FF]" : "hover:bg-[#F8F9FA]"
                      }`}
                    >
                      <ChevronDown
                        size={14}
                        className={`shrink-0 text-[#9AA1A8] transition-transform ${isExpanded ? "" : "-rotate-90"}`}
                      />
                      <span className={`truncate text-sm font-medium ${isActive ? "text-[#4E5DE0]" : "text-[#393F41]"}`}>
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
                              className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs ${
                                isItemActive ? "bg-[#F2F4FF]" : "hover:bg-[#F8F9FA]"
                              }`}
                            >
                              <Icon
                                size={13}
                                className={`shrink-0 ${isItemActive ? "text-[#4E5DE0]" : "text-[#9AA1A8]"}`}
                              />
                              <span className={`truncate ${isItemActive ? "font-semibold text-[#4E5DE0]" : "text-[#6B7280]"}`}>
                                {item.title}
                              </span>
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleComplete(item.id);
                                }}
                                className="ml-auto shrink-0 cursor-pointer text-[#9AA1A8] hover:text-[#4E5DE0]"
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
                          <div className="px-3 py-1 text-xs text-[#9AA1A8]">No items</div>
                        )}
                      </div>
                    )}
                    {chapterIndex < course.chapters.length - 1 && (
                      <div className="mx-3 my-2 border-t border-[#ECEEEF]" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex min-w-0 flex-grow flex-col">
        {/* Progress bar */}
        <div className="flex items-center gap-4 border-b border-[#ECEEEF] bg-white px-8 py-3">
          <div className="flex-grow">
            <div className="mb-1 flex items-center justify-between text-xs text-[#6B7280]">
              <span>
                {completedIds.length} of {allItems.length} items completed
              </span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#ECEEEF]">
              <div
                className="h-full rounded-full bg-[#4E5DE0] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          {activeItem && (
            <button
              onClick={() => toggleComplete(activeItem.id)}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
                isComplete
                  ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                  : "bg-[#4E5DE0] text-white hover:bg-[#4350C8]"
              }`}
            >
              <CheckCircle2 size={16} />
              {isComplete ? "Mark incomplete" : "Mark as complete"}
            </button>
          )}
        </div>

        {/* Item content */}
        <div className="flex-grow overflow-y-auto p-8">
          {activeItem ? (
            <div className="mx-auto h-full max-w-3xl rounded-xl border border-[#ECEEEF] bg-white p-8">
              <ItemViewer item={activeItem} />
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <FileText size={48} className="text-[#9AA1A8]" />
              <div className="text-lg font-semibold text-[#232228]">Select an item to begin</div>
              <p className="max-w-md text-sm text-[#6B7280]">
                Choose a chapter item from the sidebar to view its content.
              </p>
            </div>
          )}
        </div>

        {/* Prev / Next */}
        {allItems.length > 0 && (
          <div className="flex items-center justify-between border-t border-[#ECEEEF] bg-white px-8 py-3">
            <button
              onClick={() => goToIndex(activeIndex - 1)}
              disabled={activeIndex <= 0}
              className="flex items-center gap-1.5 rounded-lg border border-[#C9CED3] bg-white px-4 py-2 text-sm font-medium text-[#393F41] hover:bg-[#F7F9FA] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <span className="text-sm text-[#6B7280]">
              {activeIndex + 1} / {allItems.length}
            </span>
            <button
              onClick={() => goToIndex(activeIndex + 1)}
              disabled={activeIndex >= allItems.length - 1}
              className="flex items-center gap-1.5 rounded-lg bg-[#4E5DE0] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4350C8] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
