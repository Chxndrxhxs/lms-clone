import { useState } from "react";
import { X, Upload } from "lucide-react";
import type { FileMeta } from "../context/CourseContext";
import { courseApi } from "../api/courses";
import { MarkdownEditor } from "./MarkdownEditor";

export type ItemType =
  | "pdf"
  | "video"
  | "audio"
  | "scorm"
  | "file"
  | "heading"
  | "text"
  | "link"
  | "quiz"
  | "livetest"
  | "liveclass"
  | "assignment"
  | "coding"
  | "form";

export type ItemSubmitData = {
  title: string;
  description?: string;
  url?: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  fileMeta?: FileMeta;
  fileData?: string;
};

type ItemModalProps = {
  type: ItemType;
  onClose: () => void;
  onSubmit?: (data: ItemSubmitData) => void;
  initialData?: Partial<ItemSubmitData>;
};

const meta: Record<ItemType, { title: string; needsUpload?: boolean }> = {
  pdf: { title: "New PDF", needsUpload: true },
  video: { title: "New Video", needsUpload: true },
  audio: { title: "New Audio", needsUpload: true },
  scorm: { title: "New SCORM", needsUpload: true },
  file: { title: "New File", needsUpload: true },
  heading: { title: "New heading" },
  text: { title: "New Text" },
  link: { title: "New Link" },
  quiz: { title: "New Quiz" },
  livetest: { title: "New Live test" },
  liveclass: { title: "New Live class" },
  assignment: { title: "New Assignment" },
  coding: { title: "New Coding test" },
  form: { title: "New Form" },
};

export function ItemModal({ type, onClose, onSubmit, initialData }: ItemModalProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [url, setUrl] = useState(initialData?.url ?? "");
  const [startDate, setStartDate] = useState(initialData?.startDate ?? "");
  const [endDate, setEndDate] = useState(initialData?.endDate ?? "");
  const [duration, setDuration] = useState(initialData?.duration ?? "");
  const [file, setFile] = useState<File | null>(null);

  const { title: modalTitle, needsUpload } = meta[type];
  const headerTitle = initialData ? modalTitle.replace(/^New /, "Edit ") : modalTitle;
  const existingFile = initialData?.fileMeta;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let fileData: string | undefined;
    let fileMeta: FileMeta | undefined = existingFile;
    if (file) {
      try {
        const result = await courseApi.uploadFile(file);
        fileData = result.url;
        fileMeta = { name: result.name, size: result.size, type: result.type };
      } catch (err) {
        console.error("File upload failed", err);
      }
    }
    onSubmit?.({
      title: title.trim(),
      description: description.trim() || undefined,
      url: url.trim() || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      duration: duration || undefined,
      fileMeta,
      fileData: fileData ?? initialData?.fileData,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-[#ECEEEF] px-6 py-4">
          <div className="text-base font-semibold text-[#0F1013]">{headerTitle}</div>
          <button onClick={onClose} className="text-[#9AA1A8] hover:text-[#393F41]" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-y-auto">
          <div className="p-6 space-y-4 flex-grow">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-[#0F1013] mb-1.5">Title *</label>
              <input
                type="text"
                required
                className="w-full rounded-lg border border-[#C9CED3] px-3 py-2.5 text-sm text-[#393F41] outline-none focus:border-[#4E5DE0]"
                placeholder={needsUpload ? `${meta[type].title} title` : "Enter title"}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {needsUpload && (
              <div>
                <label className="block text-sm font-medium text-[#0F1013] mb-1.5">
                  {type === "video" ? "Upload video or YouTube/Vimeo URL" : `Upload ${type.toUpperCase()} file`} *
                </label>
                <label className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#C9CED3] bg-[#F8F9FA] px-4 py-8 cursor-pointer hover:border-[#4E5DE0]">
                  <Upload size={24} className="text-[#9AA1A8]" />
                  <span className="text-sm text-[#393F41] font-medium">
                    {file
                      ? file.name
                      : existingFile
                        ? `Already uploaded: ${existingFile.name}`
                        : "Click to browse or drag & drop"}
                  </span>
                  {type === "video" && (
                    <span className="text-xs text-[#6B7280]">Videos are secure, non-downloadable, and support YouTube/Vimeo embeds.</span>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>
            )}

            {type === "video" && (
              <div>
                <label className="block text-sm font-medium text-[#0F1013] mb-1.5">YouTube / Vimeo URL</label>
                <input
                  type="url"
                  className="w-full rounded-lg border border-[#C9CED3] px-3 py-2.5 text-sm text-[#393F41] outline-none focus:border-[#4E5DE0]"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
            )}

            {type === "link" && (
              <div>
                <label className="block text-sm font-medium text-[#0F1013] mb-1.5">URL *</label>
                <input
                  type="url"
                  required
                  className="w-full rounded-lg border border-[#C9CED3] px-3 py-2.5 text-sm text-[#393F41] outline-none focus:border-[#4E5DE0]"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <p className="mt-1.5 text-xs text-[#6B7280]">The link will be embedded in an iframe.</p>
              </div>
            )}

            {(type === "text" || type === "assignment" || type === "coding" || type === "quiz" || type === "form") && (
              <div>
                <label className="block text-sm font-medium text-[#0F1013] mb-1.5">Description *</label>
                {type === "text" ? (
                  <MarkdownEditor
                    value={description}
                    onChange={setDescription}
                    required
                    minHeight={120}
                    placeholder="Write your notes/content in Markdown..."
                  />
                ) : (
                  <textarea
                    required
                    rows={4}
                    className="w-full rounded-lg border border-[#C9CED3] px-3 py-2.5 text-sm text-[#393F41] outline-none focus:border-[#4E5DE0] resize-none"
                    placeholder={
                      type === "assignment"
                        ? "Write assignment instructions for learners..."
                        : type === "coding"
                          ? "Describe the coding problem learners will solve..."
                          : type === "quiz"
                            ? "Describe the quiz..."
                            : "Describe the form / what information you want to collect..."
                    }
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                )}
              </div>
            )}

            {type === "livetest" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#0F1013] mb-1.5">Start date & time *</label>
                    <input
                      type="datetime-local"
                      required
                      className="w-full rounded-lg border border-[#C9CED3] px-3 py-2.5 text-sm text-[#393F41] outline-none focus:border-[#4E5DE0]"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0F1013] mb-1.5">End date & time *</label>
                    <input
                      type="datetime-local"
                      required
                      className="w-full rounded-lg border border-[#C9CED3] px-3 py-2.5 text-sm text-[#393F41] outline-none focus:border-[#4E5DE0]"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
                <p className="text-xs text-[#6B7280]">
                  Learners can attempt it during the specified time window. Results visible post declaration.
                </p>
              </>
            )}

            {type === "liveclass" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#0F1013] mb-1.5">Date & time *</label>
                    <input
                      type="datetime-local"
                      required
                      className="w-full rounded-lg border border-[#C9CED3] px-3 py-2.5 text-sm text-[#393F41] outline-none focus:border-[#4E5DE0]"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0F1013] mb-1.5">Duration (minutes)</label>
                    <input
                      type="number"
                      min={1}
                      className="w-full rounded-lg border border-[#C9CED3] px-3 py-2.5 text-sm text-[#393F41] outline-none focus:border-[#4E5DE0]"
                      placeholder="60"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                  </div>
                </div>
                <p className="text-xs text-[#6B7280]">Conduct live classes and webinars with your learners.</p>
              </>
            )}
          </div>

          <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#ECEEEF] bg-white">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg text-sm font-medium text-[#4E5DE0] px-3 py-2 hover:bg-[#F7F9FA]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#4E5DE0] px-5 py-2 text-sm font-semibold text-white hover:bg-[#4350C8]"
            >
              {initialData ? "Save changes" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}