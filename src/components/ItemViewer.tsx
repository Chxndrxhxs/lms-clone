import { lazy, Suspense, useState } from "react";
import {
  FileText,
  Video,
  Music,
  File,
  Link as LinkIcon,
  HelpCircle,
  AlarmClock,
  ClipboardList,
  Code,
  ClipboardCheck,
  type LucideIcon,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { CourseItem } from "../context/CourseContext";

const PdfViewer = lazy(() => import("./PdfViewer").then((m) => ({ default: m.PdfViewer })));

function getYouTubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/
  );
  return m?.[1] ?? null;
}

function getVimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(\d+)/);
  return m?.[1] ?? null;
}

const typeIcons: Record<string, LucideIcon> = {
  pdf: FileText,
  video: Video,
  audio: Music,
  scorm: FileText,
  file: File,
  text: FileText,
  link: LinkIcon,
  quiz: HelpCircle,
  livetest: AlarmClock,
  liveclass: Video,
  assignment: ClipboardList,
  coding: Code,
  form: ClipboardCheck,
};

function QuizViewer({ item }: { item: CourseItem }) {
  const questions = item.quizQuestions ?? [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<string, boolean>>({});

  if (questions.length === 0) {
    return <Placeholder item={item} />;
  }

  const q = questions[currentIndex];
  const selectedOptId = selectedAnswers[q.id];
  const isSubmitted = submittedQuestions[q.id];
  const isCorrect = selectedOptId === q.correctOptionId;

  const handleSelectOption = (optId: string) => {
    if (isSubmitted) return;
    setSelectedAnswers({ ...selectedAnswers, [q.id]: optId });
  };

  const handleCheckAnswer = () => {
    if (!selectedOptId) return;
    setSubmittedQuestions({ ...submittedQuestions, [q.id]: true });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setSubmittedQuestions({});
    setCurrentIndex(0);
    setShowResults(false);
  };

  if (showResults) {
    const correctCount = questions.filter((quest) => selectedAnswers[quest.id] === quest.correctOptionId).length;
    const percentage = Math.round((correctCount / questions.length) * 100);

    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="bg-[#F2F4FF] p-6 text-[#4E5DE0]">
          <HelpCircle size={48} />
        </div>
        <h3 className="text-xl font-bold text-[#0F1013]">Quiz Completed!</h3>
        <p className="text-sm text-[#6B7280]">
          You scored <span className="font-semibold text-[#0F1013]">{correctCount}</span> out of{" "}
          <span className="font-semibold text-[#0F1013]">{questions.length}</span> ({percentage}%)
        </p>
        <button
          onClick={handleRetake}
          className="bg-[#4E5DE0] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#4350C8]"
        >
          Retake Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto py-4">
      <div className="flex items-center justify-between text-xs font-semibold text-[#6B7280]">
        <span>QUESTION {currentIndex + 1} OF {questions.length}</span>
        <span>{Math.round(((currentIndex + 1) / questions.length) * 100)}% Completed</span>
      </div>

      <div className="w-full bg-[#ECEEEF] h-1.5 overflow-hidden">
        <div
          className="bg-[#4E5DE0] h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="border border-[#ECEEEF] bg-white p-6 shadow-sm space-y-6">
        <h4 className="text-base font-semibold text-[#0F1013]">{q.question}</h4>

        <div className="space-y-3">
          {q.options.map((opt) => {
            const isSelected = selectedOptId === opt.id;
            const isThisCorrect = opt.id === q.correctOptionId;
            let optionStyle = "border-[#ECEEEF] bg-white hover:bg-[#F8F9FA]";
            if (isSubmitted) {
              if (isThisCorrect) {
                optionStyle = "border-green-500 bg-green-50 text-green-900 font-medium";
              } else if (isSelected && !isThisCorrect) {
                optionStyle = "border-red-500 bg-red-50 text-red-900 font-medium";
              }
            } else if (isSelected) {
              optionStyle = "border-[#4E5DE0] bg-[#F2F4FF] text-[#4E5DE0] font-medium";
            }

            return (
              <div
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                className={`flex items-center gap-3 border p-4 cursor-pointer transition-all ${optionStyle}`}
              >
                <div
                  className={`flex h-5 w-5 items-center justify-center border text-xs font-bold ${
                    isSelected ? "border-[#4E5DE0] bg-[#4E5DE0] text-white" : "border-[#C9CED3] text-[#6B7280]"
                  }`}
                >
                  {isSelected ? "✓" : ""}
                </div>
                <span className="text-sm">{opt.text}</span>
              </div>
            );
          })}
        </div>

        {isSubmitted && q.explanation && (
          <div className={`p-4 text-xs ${isCorrect ? "bg-green-50 text-green-800" : "bg-amber-50 text-amber-800"}`}>
            <span className="font-semibold">Explanation: </span>
            {q.explanation}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-[#ECEEEF]">
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(currentIndex - 1)}
            className="border border-[#ECEEEF] px-4 py-2 text-sm font-medium text-[#393F41] disabled:opacity-40"
          >
            Previous
          </button>

          {!isSubmitted ? (
            <button
              disabled={!selectedOptId}
              onClick={handleCheckAnswer}
              className="bg-[#4E5DE0] px-6 py-2 text-sm font-semibold text-white hover:bg-[#4350C8] disabled:opacity-40"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="bg-[#4E5DE0] px-6 py-2 text-sm font-semibold text-white hover:bg-[#4350C8]"
            >
              {currentIndex < questions.length - 1 ? "Next Question" : "View Results"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Placeholder({ item }: { item: CourseItem }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 h-full text-center py-20">
      <FileText size={48} className="text-[#9AA1A8]" />
      <div className="text-lg font-semibold text-[#232228]">{item.title}</div>
      <p className="text-sm text-[#6B7280] max-w-md">
        No preview available for this item type.
      </p>
      {item.description && <p className="text-sm text-[#6B7280] max-w-xl">{item.description}</p>}
    </div>
  );
}

export function ItemViewer({ item }: { item: CourseItem }) {
  const Icon = typeIcons[item.type] ?? FileText;
  const ytId = item.url ? getYouTubeId(item.url) : null;
  const vimeoId = item.url ? getVimeoId(item.url) : null;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 pb-4 mb-4 border-b border-[#ECEEEF]">
        <Icon size={18} className="text-[#4E5DE0] shrink-0" />
        <span className="text-base font-semibold text-[#0F1013] truncate">{item.title}</span>
        <span className="ml-auto shrink-0 bg-[#F2F4FF] px-2 py-0.5 text-xs font-medium text-[#4E5DE0] capitalize">
          {item.type}
        </span>
      </div>

      <div className="grow min-h-0 overflow-auto">
        {item.type === "text" && (
          <div className="markdown-body text-sm text-[#393F41]">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.description ?? ""}</ReactMarkdown>
          </div>
        )}

        {item.type === "video" && ytId && (
          <div className="aspect-video w-full overflow-hidden ">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${ytId}`}
              title={item.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        )}

        {item.type === "video" && !ytId && vimeoId && (
          <div className="aspect-video w-full overflow-hidden ">
            <iframe
              className="h-full w-full"
              src={`https://player.vimeo.com/video/${vimeoId}`}
              title={item.title}
              allowFullScreen
            />
          </div>
        )}

        {item.type === "video" && !ytId && !vimeoId && item.fileData && (
          <video controls src={item.fileData} className="w-full max-h-[60vh] bg-black" />
        )}

        {item.type === "video" && !ytId && !vimeoId && !item.fileData && <Placeholder item={item} />}

        {item.type === "pdf" && item.fileData && (
          <Suspense
            fallback={
              <div className="flex h-full items-center justify-center text-sm text-neutral-500">
                Loading PDF...
              </div>
            }
          >
            <PdfViewer url={item.fileData} title={item.title} />
          </Suspense>
        )}

        {item.type === "pdf" && !item.fileData && <Placeholder item={item} />}

        {(item.type === "scorm" || item.type === "file") && item.fileData && (
          <iframe src={item.fileData} title={item.title} className="h-[70vh] w-full border border-[#ECEEEF]" />
        )}

        {(item.type === "scorm" || item.type === "file") && !item.fileData && (
          <Placeholder item={item} />
        )}

        {item.type === "audio" && item.fileData && (
          <audio controls src={item.fileData} className="w-full" />
        )}

        {item.type === "audio" && !item.fileData && <Placeholder item={item} />}

        {item.type === "link" && item.url && (
          <iframe src={item.url} title={item.title} className="h-[70vh] w-full border border-[#ECEEEF]" />
        )}

        {item.type === "link" && !item.url && <Placeholder item={item} />}

        {item.type === "quiz" && (
          item.quizQuestions && item.quizQuestions.length > 0 ? (
            <QuizViewer item={item} />
          ) : (
            <Placeholder item={item} />
          )
        )}

        {(item.type === "livetest" ||
          item.type === "liveclass" ||
          item.type === "assignment" ||
          item.type === "coding" ||
          item.type === "form") && <Placeholder item={item} />}
      </div>
    </div>
  );
}
