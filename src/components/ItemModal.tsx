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

export type ItemSubmitData = {
  title: string;
  description?: string;
  url?: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  fileMeta?: FileMeta;
  fileData?: string;
  quizQuestions?: QuizQuestion[];
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
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(
    initialData?.quizQuestions ?? [
      {
        id: "1",
        question: "",
        options: [
          { id: "opt_1", text: "" },
          { id: "opt_2", text: "" },
        ],
        correctOptionId: "opt_1",
        explanation: "",
      },
    ]
  );

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
      quizQuestions: type === "quiz" ? quizQuestions : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg bg-white shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
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
                className="w-full border border-[#C9CED3] px-3 py-2.5 text-sm text-[#393F41] outline-none focus:border-[#4E5DE0]"
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
                <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#C9CED3] bg-[#F8F9FA] px-4 py-8 cursor-pointer hover:border-[#4E5DE0]">
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
                  className="w-full border border-[#C9CED3] px-3 py-2.5 text-sm text-[#393F41] outline-none focus:border-[#4E5DE0]"
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
                  className="w-full border border-[#C9CED3] px-3 py-2.5 text-sm text-[#393F41] outline-none focus:border-[#4E5DE0]"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <p className="mt-1.5 text-xs text-[#6B7280]">The link will be embedded in an iframe.</p>
              </div>
            )}

            {type === "quiz" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-[#0F1013]">Quiz Questions</label>
                  <button
                    type="button"
                    onClick={() => {
                      const newId = Date.now().toString();
                      const newOptId1 = `opt_${Date.now()}_1`;
                      const newOptId2 = `opt_${Date.now()}_2`;
                      setQuizQuestions([
                        ...quizQuestions,
                        {
                          id: newId,
                          question: "",
                          options: [
                            { id: newOptId1, text: "" },
                            { id: newOptId2, text: "" },
                          ],
                          correctOptionId: newOptId1,
                          explanation: "",
                        },
                      ]);
                    }}
                    className="bg-[#F2F4FF] px-3 py-1.5 text-xs font-semibold text-[#4E5DE0] hover:bg-[#E8ECFF]"
                  >
                    + Add Question
                  </button>
                </div>

                {quizQuestions.map((q, qIndex) => (
                  <div key={q.id} className="border border-[#ECEEEF] bg-[#F8F9FA] p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#393F41]">Question {qIndex + 1}</span>
                      {quizQuestions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setQuizQuestions(quizQuestions.filter((item) => item.id !== q.id))}
                          className="text-xs text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      )}
                    </div>

                    <div>
                      <input
                        type="text"
                        required
                        className="w-full border border-[#C9CED3] bg-white px-3 py-2 text-sm text-[#393F41] outline-none focus:border-[#4E5DE0]"
                        placeholder="Enter question text..."
                        value={q.question}
                        onChange={(e) => {
                          const val = e.target.value;
                          setQuizQuestions(
                            quizQuestions.map((item) => (item.id === q.id ? { ...item, question: val } : item))
                          );
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-[#6B7280]">Options (Select the correct answer)</label>
                      {q.options.map((opt, optIndex) => (
                        <div key={opt.id} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct_${q.id}`}
                            checked={q.correctOptionId === opt.id}
                            onChange={() => {
                              setQuizQuestions(
                                quizQuestions.map((item) =>
                                  item.id === q.id ? { ...item, correctOptionId: opt.id } : item
                                )
                              );
                            }}
                            className="accent-[#4E5DE0]"
                            title="Mark as correct answer"
                          />
                          <input
                            type="text"
                            required
                            className="flex-grow border border-[#C9CED3] bg-white px-3 py-1.5 text-sm text-[#393F41] outline-none focus:border-[#4E5DE0]"
                            placeholder={`Option ${optIndex + 1}`}
                            value={opt.text}
                            onChange={(e) => {
                              const text = e.target.value;
                              setQuizQuestions(
                                quizQuestions.map((item) =>
                                  item.id === q.id
                                    ? {
                                        ...item,
                                        options: item.options.map((o) => (o.id === opt.id ? { ...o, text } : o)),
                                      }
                                    : item
                                )
                              );
                            }}
                          />
                          {q.options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => {
                                const newOpts = q.options.filter((o) => o.id !== opt.id);
                                let newCorrect = q.correctOptionId;
                                if (q.correctOptionId === opt.id) {
                                  newCorrect = newOpts[0]?.id ?? "";
                                }
                                setQuizQuestions(
                                  quizQuestions.map((item) =>
                                    item.id === q.id ? { ...item, options: newOpts, correctOptionId: newCorrect } : item
                                  )
                                );
                              }}
                              className="text-xs text-[#9AA1A8] hover:text-red-600 px-1"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                      {q.options.length < 6 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newOptId = `opt_${Date.now()}_${q.options.length + 1}`;
                            setQuizQuestions(
                              quizQuestions.map((item) =>
                                item.id === q.id
                                  ? { ...item, options: [...item.options, { id: newOptId, text: "" }] }
                                  : item
                              )
                            );
                          }}
                          className="text-xs font-medium text-[#4E5DE0] hover:underline mt-1 block"
                        >
                          + Add Option
                        </button>
                      )}
                    </div>

                    <div>
                      <input
                        type="text"
                        className="w-full border border-[#C9CED3] bg-white px-3 py-1.5 text-xs text-[#393F41] outline-none focus:border-[#4E5DE0]"
                        placeholder="Explanation (optional, shown after answering)..."
                        value={q.explanation ?? ""}
                        onChange={(e) => {
                          const explanation = e.target.value;
                          setQuizQuestions(
                            quizQuestions.map((item) => (item.id === q.id ? { ...item, explanation } : item))
                          );
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {(type === "text" || type === "assignment" || type === "coding" || type === "form") && (
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
                    className="w-full border border-[#C9CED3] px-3 py-2.5 text-sm text-[#393F41] outline-none focus:border-[#4E5DE0] resize-none"
                    placeholder={
                      type === "assignment"
                        ? "Write assignment instructions for learners..."
                        : type === "coding"
                          ? "Describe the coding problem learners will solve..."
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
                      className="w-full border border-[#C9CED3] px-3 py-2.5 text-sm text-[#393F41] outline-none focus:border-[#4E5DE0]"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0F1013] mb-1.5">End date & time *</label>
                    <input
                      type="datetime-local"
                      required
                      className="w-full border border-[#C9CED3] px-3 py-2.5 text-sm text-[#393F41] outline-none focus:border-[#4E5DE0]"
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
                      className="w-full border border-[#C9CED3] px-3 py-2.5 text-sm text-[#393F41] outline-none focus:border-[#4E5DE0]"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0F1013] mb-1.5">Duration (minutes)</label>
                    <input
                      type="number"
                      min={1}
                      className="w-full border border-[#C9CED3] px-3 py-2.5 text-sm text-[#393F41] outline-none focus:border-[#4E5DE0]"
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
              className="text-sm font-medium text-[#4E5DE0] px-3 py-2 hover:bg-[#F7F9FA]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#4E5DE0] px-5 py-2 text-sm font-semibold text-white hover:bg-[#4350C8]"
            >
              {initialData ? "Save changes" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}