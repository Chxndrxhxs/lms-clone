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
        <Icon size={18} className="text-[#4E5DE0] flex-shrink-0" />
        <span className="text-base font-semibold text-[#0F1013] truncate">{item.title}</span>
        <span className="ml-auto shrink-0 rounded-full bg-[#F2F4FF] px-2 py-0.5 text-xs font-medium text-[#4E5DE0] capitalize">
          {item.type}
        </span>
      </div>

      <div className="flex-grow min-h-0 overflow-auto">
        {item.type === "text" && (
          <div className="markdown-body text-sm text-[#393F41]">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.description ?? ""}</ReactMarkdown>
          </div>
        )}

        {item.type === "video" && ytId && (
          <div className="aspect-video w-full overflow-hidden rounded-lg">
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
          <div className="aspect-video w-full overflow-hidden rounded-lg">
            <iframe
              className="h-full w-full"
              src={`https://player.vimeo.com/video/${vimeoId}`}
              title={item.title}
              allowFullScreen
            />
          </div>
        )}

        {item.type === "video" && !ytId && !vimeoId && item.fileData && (
          <video controls src={item.fileData} className="w-full max-h-[60vh] rounded-lg bg-black" />
        )}

        {item.type === "video" && !ytId && !vimeoId && !item.fileData && <Placeholder item={item} />}

        {(item.type === "pdf" || item.type === "scorm" || item.type === "file") && item.fileData && (
          <iframe src={item.fileData} title={item.title} className="h-[70vh] w-full rounded-lg border border-[#ECEEEF]" />
        )}

        {(item.type === "pdf" || item.type === "scorm" || item.type === "file") && !item.fileData && (
          <Placeholder item={item} />
        )}

        {item.type === "audio" && item.fileData && (
          <audio controls src={item.fileData} className="w-full" />
        )}

        {item.type === "audio" && !item.fileData && <Placeholder item={item} />}

        {item.type === "link" && item.url && (
          <iframe src={item.url} title={item.title} className="h-[70vh] w-full rounded-lg border border-[#ECEEEF]" />
        )}

        {item.type === "link" && !item.url && <Placeholder item={item} />}

        {(item.type === "quiz" ||
          item.type === "livetest" ||
          item.type === "liveclass" ||
          item.type === "assignment" ||
          item.type === "coding" ||
          item.type === "form") && <Placeholder item={item} />}
      </div>
    </div>
  );
}
