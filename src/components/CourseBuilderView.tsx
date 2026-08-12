import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Eye,
  Upload,
  Cloud,
  Plus,
  Star,
  Sparkles,
  ImagePlus,
  Library,
  ChevronDown,
  X,
  FileText,
  Link,
  Video,
  Music,
  File,
  HelpCircle,
  AlarmClock,
  ClipboardList,
  Code,
  ClipboardCheck,
  Trash2,
  Pencil,
  type LucideIcon,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { ItemModal, type ItemType } from "./ItemModal";
import type { ItemSubmitData } from "./ItemModal";
import { useCourses, type CourseChapter } from "../context/CourseContext";
import { courseApi } from "../api/courses";
import { ItemViewer } from "./ItemViewer";

const itemTypeIcons: Record<string, LucideIcon> = {
  pdf: FileText,
  video: Video,
  audio: Music,
  scorm: FileText,
  file: File,
  heading: FileText,
  text: FileText,
  link: Link,
  quiz: HelpCircle,
  livetest: AlarmClock,
  liveclass: Video,
  assignment: ClipboardList,
  coding: Code,
  form: ClipboardCheck,
};

export function CourseBuilderView() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { courses, draft, editingCourseId, startEditCourse, updateDraft, addChapter, updateChapterItems, deleteChapterItem, saveCourse, loading } = useCourses();
  const chapters = draft.chapters;
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [menuItemId, setMenuItemId] = useState<number | null>(null);
  const [menuChapterId, setMenuChapterId] = useState<number | null>(null);
  const [editingChapterId, setEditingChapterId] = useState<number | null>(null);
  const [editingChapterTitle, setEditingChapterTitle] = useState("");
  const [editingItem, setEditingItem] = useState<{ chapterId: number; itemId: number } | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [activeItemType, setActiveItemType] = useState<ItemType | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleDeleteChapter = (chapterId: number) => {
    updateDraft({
      chapters: chapters.filter((ch) => ch.id !== chapterId),
    });
    if (selectedChapterId === chapterId) {
      setSelectedChapterId(null);
      setSelectedItemId(null);
    }
    setMenuChapterId(null);
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const result = await courseApi.uploadFile(file);
      updateDraft({ cover: result.url });
    } catch (err) {
      console.error("Cover upload failed", err);
    }
  };

  useEffect(() => {
    if (courseId != null && editingCourseId !== Number(courseId)) {
      startEditCourse(Number(courseId));
    }
  }, [courseId, editingCourseId, startEditCourse, courses]);

  useEffect(() => {
    if (menuItemId == null && menuChapterId == null) return;
    const close = () => {
      setMenuItemId(null);
      setMenuChapterId(null);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [menuItemId, menuChapterId]);

  const openItemModal = (type: ItemType) => {
    setIsAddItemModalOpen(false);
    setActiveItemType(type);
  };

  const handleBack = () => {
    navigate(editingCourseId != null ? `/courses/${editingCourseId}` : "/courses/create");
  };

  const handleAddChapter = () => {
    const newChapter: CourseChapter = {
      id: Date.now(),
      title: `Chapter ${chapters.length + 1}`,
      items: [],
    };
    addChapter(newChapter);
    setSelectedChapterId(newChapter.id);
  };

  const handleSave = async () => {
    const editId = editingCourseId;
    await saveCourse();
    navigate(editId != null ? `/courses/${editId}` : "/courses");
  };

  const handleSetUserPreview = async () => {
    const id = await saveCourse();
    if (id != null) navigate(`/courses/${id}/preview`);
  };

  const handleItemSubmit = (data: ItemSubmitData) => {
    if (!data.title) return;
    if (editingItem) {
      const targetChapter = chapters.find((ch) => ch.id === editingItem.chapterId);
      const existing = targetChapter?.items.find((it) => it.id === editingItem.itemId);
      if (targetChapter && existing) {
        const updated = {
          ...existing,
          title: data.title,
          description: data.description,
          url: data.url,
          startDate: data.startDate,
          endDate: data.endDate,
          duration: data.duration,
          fileMeta: data.fileMeta,
          fileData: data.fileData,
          quizQuestions: data.quizQuestions,
        };
        updateChapterItems(
          editingItem.chapterId,
          targetChapter.items.map((it) => (it.id === editingItem.itemId ? updated : it))
        );
      }
      setEditingItem(null);
      setActiveItemType(null);
      setIsAddItemModalOpen(false);
      return;
    }
    if (activeItemType === "heading") {
      const newChapter: CourseChapter = { id: Date.now(), title: data.title, items: [] };
      addChapter(newChapter);
      setSelectedChapterId(newChapter.id);
      setSelectedItemId(null);
    } else if (activeItemType && selectedChapterId != null) {
      const item = {
        id: Date.now(),
        title: data.title,
        type: activeItemType,
        description: data.description,
        url: data.url,
        startDate: data.startDate,
        endDate: data.endDate,
        duration: data.duration,
        fileMeta: data.fileMeta,
        fileData: data.fileData,
        quizQuestions: data.quizQuestions,
      };
      const target = chapters.find((ch) => ch.id === selectedChapterId);
      if (target) {
        updateChapterItems(selectedChapterId, [...target.items, item]);
      }
      setSelectedItemId(item.id);
    }
    setActiveItemType(null);
    setIsAddItemModalOpen(false);
  };

  const selectedItem = selectedItemId != null
    ? chapters.flatMap((ch) => ch.items).find((it) => it.id === selectedItemId)
    : undefined;

  const editingItemData = editingItem != null
    ? chapters.find((ch) => ch.id === editingItem.chapterId)?.items.find((it) => it.id === editingItem.itemId)
    : undefined;

  const handleDeleteItem = (chapterId: number, itemId: number) => {
    deleteChapterItem(chapterId, itemId);
    if (selectedItemId === itemId) setSelectedItemId(null);
    setMenuItemId(null);
  };

  if (courseId != null && loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-sm text-[#6B7280]">Loading course...</div>
      </div>
    );
  }

  return (
    <div id="courseCont" className="min-h-screen bg-white flex flex-col editMode">
      <div className="docs-container flex flex-col flex-grow">
        {/* Header */}
        <div className="flex items-center gap-4 px-6 py-4 border-b border-[#ECEEEF]">
          <button
            onClick={handleBack}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#4E5DE0] hover:bg-[#F7F9FA]"
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>
          <input
            className="text-xl font-semibold text-[#0F1013] bg-transparent outline-none focus:border-b focus:border-[#4E5DE0] max-w-[1480px]"
            value={draft.title}
            onChange={(e) => updateDraft({ title: e.target.value })}
            title={draft.title}
          />
          <div className="ml-auto flex items-center gap-3">
            <button
              className="flex items-center gap-2 rounded-lg border border-[#ECEEEF] bg-white px-4 py-2 text-sm font-medium text-[#393F41] hover:bg-[#F7F9FA]"
              title="Preview course as learner"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => setIsPublishModalOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-[#ECEEEF] bg-white px-4 py-2 text-sm font-medium text-[#393F41] hover:bg-[#F7F9FA]"
            >
              <Upload size={16} />
              Publish course
            </button>
            <button
              onClick={handleSave}
              className="saveCourseBtn flex items-center gap-2 rounded-lg bg-[#4E5DE0] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4350C8]"
            >
              <Cloud size={16} />
              Save course
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-grow">
          {/* Left */}
          <div className="w-80 shrink-0 border-r border-[#ECEEEF] flex flex-col">
            <div className="flex-grow overflow-y-auto p-4">
              {/* Course meta */}
              <div className="mb-6">
                <div
                  onClick={() => coverInputRef.current?.click()}
                  className="relative rounded-lg border-2 border-dashed border-[#D1D5DA] bg-[#F8F9FA] aspect-video flex flex-col items-center justify-center cursor-pointer text-[#393F41] hover:border-[#4E5DE0] overflow-hidden"
                  title="Upload course cover"
                >
                  {draft.cover ? (
                    <img src={draft.cover} alt="Course cover" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <ImagePlus size={24} className="text-[#9AA1A8]" />
                      <span className="mt-1 text-sm font-medium">Add course cover</span>
                    </>
                  )}
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverUpload}
                  />
                </div>
                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={handleSetUserPreview}
                    className="rounded-lg border border-[#ECEEEF] bg-white px-3 py-1.5 text-xs font-medium text-[#393F41] hover:bg-[#F7F9FA]"
                  >
                    Set user preview
                  </button>
                  <button className="rounded-lg border border-[#ECEEEF] bg-white px-3 py-1.5 text-xs font-medium text-[#393F41] hover:bg-[#F7F9FA]">
                    Set rules
                  </button>
                </div>
              </div>

              {/* Chapters */}
              {chapters.length > 0 && (
                <div className="itemsCont">
                  <div className="courseItems space-y-2">
                    {chapters.map((chapter) => {
                      const isSelected = chapter.id === selectedChapterId;
                      return (
                        <div
                          key={chapter.id}
                          className={`rounded-lg border transition-colors ${
                            isSelected ? "border-[#4E5DE0]" : "border-[#ECEEEF]"
                          }`}
                        >
                          <div
                            className={`relative flex items-center justify-between px-3 py-2.5 cursor-pointer ${
                              isSelected ? "bg-[#F2F4FF]" : "bg-white hover:bg-[#F8F9FA]"
                            }`}
                            onClick={() => {
                              setSelectedChapterId(chapter.id);
                              setSelectedItemId(null);
                              setMenuItemId(null);
                              setMenuChapterId(null);
                            }}
                          >
                            <div className="flex items-center gap-2 min-w-0 flex-grow mr-2">
                              <ChevronDown size={14} className="text-[#9AA1A8] flex-shrink-0" />
                              {editingChapterId === chapter.id ? (
                                <input
                                  type="text"
                                  autoFocus
                                  className="text-sm font-medium text-[#393F41] bg-white border border-[#4E5DE0] rounded px-2 py-0.5 outline-none w-full"
                                  value={editingChapterTitle}
                                  onChange={(e) => setEditingChapterTitle(e.target.value)}
                                  onBlur={() => {
                                    if (editingChapterTitle.trim()) {
                                      updateDraft({
                                        chapters: chapters.map((ch) =>
                                          ch.id === chapter.id ? { ...ch, title: editingChapterTitle.trim() } : ch
                                        ),
                                      });
                                    }
                                    setEditingChapterId(null);
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      if (editingChapterTitle.trim()) {
                                        updateDraft({
                                          chapters: chapters.map((ch) =>
                                            ch.id === chapter.id ? { ...ch, title: editingChapterTitle.trim() } : ch
                                          ),
                                        });
                                      }
                                      setEditingChapterId(null);
                                    } else if (e.key === "Escape") {
                                      setEditingChapterId(null);
                                    }
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              ) : (
                                <span className="text-sm font-medium text-[#393F41] truncate">{chapter.title}</span>
                              )}
                            </div>
                            <button
                              className="text-[#9AA1A8] hover:text-[#393F41] p-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                setMenuChapterId(menuChapterId === chapter.id ? null : chapter.id);
                                setMenuItemId(null);
                              }}
                              aria-label="Chapter options"
                            >
                              ⋮
                            </button>
                            {menuChapterId === chapter.id && (
                              <div
                                className="absolute right-3 top-full z-20 mt-1 w-32 rounded-lg border border-[#ECEEEF] bg-white py-1 shadow-lg"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={() => {
                                    setEditingChapterId(chapter.id);
                                    setEditingChapterTitle(chapter.title);
                                    setMenuChapterId(null);
                                  }}
                                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-[#393F41] hover:bg-[#F8F9FA]"
                                >
                                  <Pencil size={12} />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteChapter(chapter.id)}
                                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-red-500 hover:bg-[#F8F9FA]"
                                >
                                  <Trash2 size={12} />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                          <div className="px-3 py-2 space-y-1.5">
                            {chapter.items.map((item) => {
                              const Icon = itemTypeIcons[item.type] ?? FileText;
                              const isItemSelected = item.id === selectedItemId;
                              return (
                                <div
                                  key={item.id}
                                  className={`relative flex items-center gap-2 pl-5 text-xs rounded-md px-2 py-1.5 -ml-2 cursor-pointer ${
                                    isItemSelected
                                      ? "bg-[#F2F4FF] text-[#4E5DE0]"
                                      : "text-[#6B7280] hover:bg-[#F8F9FA]"
                                  }`}
                                  onClick={() => {
                                    setSelectedItemId(item.id);
                                    setSelectedChapterId(chapter.id);
                                    setMenuItemId(null);
                                  }}
                                >
                                  <Icon
                                    size={13}
                                    className={`flex-shrink-0 ${isItemSelected ? "text-[#4E5DE0]" : "text-[#9AA1A8]"}`}
                                  />
                                  <span className="truncate">{item.title}</span>
                                  <button
                                    className="ml-auto text-[#9AA1A8] hover:text-[#393F41]"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setMenuItemId(menuItemId === item.id ? null : item.id);
                                    }}
                                    aria-label="Item options"
                                  >
                                    ⋮
                                  </button>
                                  {menuItemId === item.id && (
                                    <div
                                      className="absolute right-0 top-full z-20 mt-1 w-32 rounded-lg border border-[#ECEEEF] bg-white py-1 shadow-lg"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <button
                                        onClick={() => {
                                          setActiveItemType(item.type);
                                          setEditingItem({ chapterId: chapter.id, itemId: item.id });
                                          setMenuItemId(null);
                                        }}
                                        className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-[#393F41] hover:bg-[#F8F9FA]"
                                      >
                                        <Pencil size={12} />
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => handleDeleteItem(chapter.id, item.id)}
                                        className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-red-500 hover:bg-[#F8F9FA]"
                                      >
                                        <Trash2 size={12} />
                                        Delete
                                      </button>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Add new chapter */}
            <div
              onClick={() => setIsAddItemModalOpen(true)}
              className="newItemBtn p-2 text-center text-[#4E5DE0] cursor-pointer border-t border-[#ECEEEF] py-3 flex items-center justify-center gap-2 hover:bg-[#F7F9FA]"
            >
              <Plus size={16} />
              <span>Add new chapter</span>
            </div>
          </div>

          {/* Right */}
          <div id="chapterData" className="flex-grow p-6">
            {chapters.length === 0 ? (
              <div className="d-flex flex-col gap-6 mt-10 mr-8" style={{ maxWidth: 720 }}>
                {/* AI outline banner */}
                <div className="flex items-center gap-12 rounded-lg p-4" style={{ background: "#EEEFFF" }}>
                  <div className="flex flex-col gap-2 flex-grow">
                    <span className="text-xs font-bold w-[60px] rounded px-2 py-0.5" style={{ color: "#152561", background: "#FFFFFF" }}>
                      <Star size={12} className="inline mr-1" fill="currentColor" /> NEW
                    </span>
                    <div className="font-semibold text-base leading-5" style={{ color: "#232228" }}>
                      Now easily add content to your courses
                    </div>
                    <div className="text-sm font-normal leading-5 tracking-[0.015em]" style={{ color: "#393F41" }}>
                      AI will quickly create an outline for your course, which you can easily edit and modify. You can
                      add chapters, edit names, and make changes to your content quickly and easily
                    </div>
                  </div>
                  <button
                    className="generateOutlineAIBtn inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shrink-0"
                    style={{ width: 250, background: "linear-gradient(45deg, #4490FF, #0620A7)" }}
                  >
                    <Sparkles size={16} />
                    Generate outline using AI
                  </button>
                </div>

                <div className="text-center text-2xl font-semibold">OR</div>

                {/* Manual add */}
                <div className="flex items-center gap-12 rounded-lg p-4" style={{ background: "#F8F9FA" }}>
                  <div className="flex flex-col gap-2 flex-grow">
                    <div className="font-semibold text-base leading-5" style={{ color: "#232228" }}>
                      Add first chapter manually
                    </div>
                    <div className="text-sm font-normal leading-5 tracking-[0.015em]" style={{ color: "#393F41" }}>
                      Use <b>Headings</b> for adding the Chapter Heading and <b>Chapter Item</b> for adding Chapter
                      Content
                    </div>
                  </div>
                  <button
                    onClick={() => setIsAddItemModalOpen(true)}
                    className="newItemBtn inline-flex items-center justify-center rounded-lg border border-[#ECEEEF] bg-white px-4 py-2.5 text-sm font-medium text-[#393F41] hover:bg-[#F7F9FA] shrink-0"
                    style={{ width: 250 }}
                  >
                    Add manually
                  </button>
                </div>
              </div>
            ) : selectedItem ? (
              <div className="max-w-[980px] h-full">
                <ItemViewer item={selectedItem} />
              </div>
            ) : selectedChapterId ? (
              <div className="empty d-flex flex flex-col items-center justify-center text-center h-full">
                <div>
                  <div className="empty-icon">
                    <img
                      src="https://d502jbuhuh9wk.cloudfront.net/resources/images/nchapter.jpg"
                      alt="No chapter item"
                      className="mx-auto"
                    />
                  </div>
                  <p className="empty-title text-lg font-semibold text-[#232228] mt-4">Add chapter item</p>
                  <p className="empty-subtitle text-sm text-[#393F41] max-w-md mx-auto">
                    Upload anything you want or import from asset library. You can also create a quiz, live test, etc.
                  </p>
                  <div className="empty-action mt-5">
                    <button
                      onClick={() => setIsAddItemModalOpen(true)}
                      className="btn btn-primary newLabelSubItemBtn rounded-lg bg-[#4E5DE0] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#4350C8]"
                    >
                      Create
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 mt-16 text-center">
                <div className="text-base font-semibold text-[#232228]">
                  {chapters.length} chapter{chapters.length > 1 ? "s" : ""} added
                </div>
                <p className="text-sm text-[#393F41]">
                  Click on a chapter to start adding headings and content.
                </p>
                <button
                  onClick={handleAddChapter}
                  className="mt-2 inline-flex items-center gap-2 rounded-lg bg-[#4E5DE0] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#4350C8]"
                >
                  <Plus size={16} /> Add another chapter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Publish modal */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#ECEEEF] px-6 py-4">
              <div className="text-base font-semibold text-[#0F1013]">Publish course</div>
              <button onClick={() => setIsPublishModalOpen(false)} className="text-[#9AA1A8] hover:text-[#393F41]">
                ✕
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-justify text-[#6B7280]">Are you sure you want to publish ?</p>
            </div>
            <div className="flex justify-end gap-3 px-6 pb-6">
              <button
                onClick={() => setIsPublishModalOpen(false)}
                className="rounded-lg border border-[#C9CED3] bg-white px-4 py-2 text-sm font-medium text-[#393F41] hover:bg-[#F7F9FA]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsPublishModalOpen(false);
                  handleSave();
                }}
                className="rounded-lg bg-[#4E5DE0] px-5 py-2 text-sm font-semibold text-white hover:bg-[#4350C8]"
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add item modal */}
      {isAddItemModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setIsAddItemModalOpen(false)}
        >
          <div
            className="w-full max-w-[1050px] max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#ECEEEF] px-6 py-4">
              <div className="text-base font-semibold text-[#0F1013]"></div>
              <button
                onClick={() => setIsAddItemModalOpen(false)}
                className="text-[#9AA1A8] hover:text-[#393F41]"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-6 items-start">
                {/* Upload new item */}
                <div className="text-sm" style={{ wordBreak: "break-word" }}>
                  <h5 className="text-center text-base font-semibold text-[#0F1013] mb-4">Upload new item</h5>
                  <div className="space-y-3">
                    <label className="flex items-start gap-2.5 cursor-pointer" onClick={() => openItemModal("pdf")}>
                      <input type="radio" name="itemType" className="mt-1 accent-[#4E5DE0]" readOnly />
                      <span>
                        <b>PDF:</b> Add a PDF file in the course.
                      </span>
                    </label>
                    <label className="flex items-start gap-2.5 cursor-pointer" onClick={() => openItemModal("video")}>
                      <input type="radio" name="itemType" className="mt-1 accent-[#4E5DE0]" readOnly />
                      <span>
                        <b>Video:</b> All uploaded videos are completely secure and non downloadable. It can also be
                        used to embed youtube and Vimeo videos.
                      </span>
                    </label>
                    <label className="flex items-start gap-2.5 cursor-pointer" onClick={() => openItemModal("audio")}>
                      <input type="radio" name="itemType" className="mt-1 accent-[#4E5DE0]" readOnly />
                      <span>
                        <b>Audio</b>
                      </span>
                    </label>
                    <label className="flex items-start gap-2.5 cursor-pointer" onClick={() => openItemModal("scorm")}>
                      <input type="radio" name="itemType" className="mt-1 accent-[#4E5DE0]" readOnly />
                      <span>
                        <b>SCORM:</b> Import SCORM packages in the course. For more information on Scorm, please visit{" "}
                        <a
                          className="text-[#4E5DE0] underline"
                          href="https://en.wikipedia.org/wiki/Sharable_Content_Object_Reference_Model"
                          target="_blank"
                          rel="noreferrer"
                        >
                          here
                        </a>
                      </span>
                    </label>
                    <label className="flex items-start gap-2.5 cursor-pointer" onClick={() => openItemModal("file")}>
                      <input type="radio" name="itemType" className="mt-1 accent-[#4E5DE0]" readOnly />
                      <span>
                        <b>File:</b> Add any file type for learners to download.
                      </span>
                    </label>
                  </div>
                </div>

                <div className="hidden md:flex self-stretch items-center">
                  <div className="w-px bg-[#ECEEEF] self-stretch" />
                </div>

                {/* Create new item */}
                <div className="text-sm" style={{ wordBreak: "break-word" }}>
                  <h5 className="text-center text-base font-semibold text-[#0F1013] mb-4">Create new item</h5>
                  <div className="space-y-3">
                    <label className="flex items-start gap-2.5 cursor-pointer" onClick={() => openItemModal("heading")}>
                      <input type="radio" name="itemType" className="mt-1 accent-[#4E5DE0]" readOnly />
                      <span>
                        <b>Heading:</b> Define your chapter or section headings
                      </span>
                    </label>
                    <label className="flex items-start gap-2.5 cursor-pointer" onClick={() => openItemModal("text")}>
                      <input type="radio" name="itemType" className="mt-1 accent-[#4E5DE0]" readOnly />
                      <span>
                        <b>Text:</b> Add custom text or iFrame and HTML
                      </span>
                    </label>
                    <label className="flex items-start gap-2.5 cursor-pointer" onClick={() => openItemModal("link")}>
                      <input type="radio" name="itemType" className="mt-1 accent-[#4E5DE0]" readOnly />
                      <span>
                        <b>Link:</b> Add Link which will be embedded in iFrame
                      </span>
                    </label>
                    <label className="flex items-start gap-2.5 cursor-pointer" onClick={() => openItemModal("quiz")}>
                      <input type="radio" name="itemType" className="mt-1 accent-[#4E5DE0]" readOnly />
                      <span>
                        <b>Quiz:</b> Learners can any time attempt &amp; get results
                      </span>
                    </label>
                    <label className="flex items-start gap-2.5 cursor-pointer" onClick={() => openItemModal("livetest")}>
                      <input type="radio" name="itemType" className="mt-1 accent-[#4E5DE0]" readOnly />
                      <span>
                        <b>Live test:</b> Learners can attempt it during specified time window. Leadership visible post
                        result declaration.
                      </span>
                    </label>
                    <label className="flex items-start gap-2.5 cursor-pointer" onClick={() => openItemModal("liveclass")}>
                      <input type="radio" name="itemType" className="mt-1 accent-[#4E5DE0]" readOnly />
                      <span>
                        <b>Live class:</b> Conduct live classes and webinars
                      </span>
                    </label>
                    <label className="flex items-start gap-2.5 cursor-pointer" onClick={() => openItemModal("assignment")}>
                      <input type="radio" name="itemType" className="mt-1 accent-[#4E5DE0]" readOnly />
                      <span>
                        <b>Assignment:</b> Take assignments from your learners
                      </span>
                    </label>
                    <label className="flex items-start gap-2.5 cursor-pointer" onClick={() => openItemModal("coding")}>
                      <input type="radio" name="itemType" className="mt-1 accent-[#4E5DE0]" readOnly />
                      <span>
                        <div className="flex items-center gap-1">
                          <b>Coding test: </b>
                        </div>
                        Learners can write and run code to solve problems
                      </span>
                    </label>
                    <label className="flex items-start gap-2.5 cursor-pointer" onClick={() => openItemModal("form")}>
                      <input type="radio" name="itemType" className="mt-1 accent-[#4E5DE0]" readOnly />
                      <span>
                        <b>Form:</b> Collect information from learning during course
                      </span>
                    </label>
                  </div>
                </div>

                <div className="hidden md:flex self-stretch items-center">
                  <div className="w-px bg-[#ECEEEF] self-stretch" />
                </div>

                {/* Import from Asset Library */}
                <div className="flex flex-col items-center justify-center text-center">
                  <Library size={48} className="text-[#4E5DE0]" />
                  <div className="text-sm text-[#6B7280] mt-2">
                    Import from your existing course content
                  </div>
                  <button className="mt-3 rounded-lg border border-[#ECEEEF] bg-white px-4 py-2 text-sm font-medium text-[#393F41] hover:bg-[#F7F9FA]">
                    Import from Asset Library
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Item type modal (layered on top of add-item modal) */}
      {activeItemType && (
        <ItemModal
          type={activeItemType}
          onClose={() => {
            setActiveItemType(null);
            setEditingItem(null);
          }}
          onSubmit={handleItemSubmit}
          initialData={editingItemData}
        />
      )}
    </div>
  );
}