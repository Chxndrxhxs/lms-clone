import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize,
  ZoomIn,
  ZoomOut,
  FileText,
} from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const ZOOM_STEPS = [0.75, 1, 1.25, 1.5, 2, 2.5];

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function ToolbarButton({
  onClick,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="flex h-8 w-8 items-center justify-center text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

export function PdfViewer({ url, title }: { url: string; title: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoomIndex, setZoomIndex] = useState(1);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(el);
    setContainerWidth(el.clientWidth);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setPageNumber(1);
    setNumPages(0);
    setZoomIndex(1);
    setLoadError(null);
  }, [url]);

  const onDocumentLoadSuccess = useCallback(({ numPages: pages }: { numPages: number }) => {
    setNumPages(pages);
  }, []);

  const onDocumentLoadError = useCallback((error: Error) => {
    setLoadError(error.message || "Failed to load PDF");
  }, []);

  const fitWidth = Math.max(containerWidth - 2, 0);
  const scale = ZOOM_STEPS[zoomIndex] ?? 1;

  return (
    <div className="flex h-full flex-col border border-[#ECEEEF] bg-neutral-50">
      {/* Toolbar */}
      <div className="flex items-center gap-1 border-b border-[#ECEEEF] bg-white px-3 py-2">
        <FileText size={16} className="mr-1 shrink-0 text-[#4E5DE0]" />
        <span className="min-w-0 truncate text-sm font-semibold text-neutral-900">{title}</span>
        <div className="ml-auto flex items-center gap-1">
          <ToolbarButton
            title="Previous page"
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber((p) => clamp(p - 1, 1, numPages))}
          >
            <ChevronLeft size={16} />
          </ToolbarButton>
          <span className="min-w-[72px] text-center text-xs text-neutral-500">
            {numPages > 0 ? `${pageNumber} / ${numPages}` : "..."}
          </span>
          <ToolbarButton
            title="Next page"
            disabled={pageNumber >= numPages}
            onClick={() => setPageNumber((p) => clamp(p + 1, 1, numPages))}
          >
            <ChevronRight size={16} />
          </ToolbarButton>

          <div className="mx-1 h-5 w-px bg-[#ECEEEF]" />

          <ToolbarButton
            title="Zoom out"
            disabled={zoomIndex <= 0}
            onClick={() => setZoomIndex((z) => clamp(z - 1, 0, ZOOM_STEPS.length - 1))}
          >
            <ZoomOut size={16} />
          </ToolbarButton>
          <ToolbarButton
            title="Fit to width"
            onClick={() => setZoomIndex(1)}
          >
            <Maximize size={16} />
          </ToolbarButton>
          <ToolbarButton
            title="Zoom in"
            disabled={zoomIndex >= ZOOM_STEPS.length - 1}
            onClick={() => setZoomIndex((z) => clamp(z + 1, 0, ZOOM_STEPS.length - 1))}
          >
            <ZoomIn size={16} />
          </ToolbarButton>

          <div className="mx-1 h-5 w-px bg-[#ECEEEF]" />

          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            download
            title="Download PDF"
            className="flex h-8 w-8 items-center justify-center text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
          >
            <Download size={16} />
          </a>
        </div>
      </div>

      {/* Page */}
      <div ref={containerRef} className="grow overflow-auto p-4">
        {loadError ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <FileText size={48} className="text-[#9AA1A8]" />
            <div className="text-sm font-semibold text-neutral-900">Unable to load this PDF</div>
            <p className="max-w-md text-xs text-neutral-500">{loadError}</p>
          </div>
        ) : (
          <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex h-full items-center justify-center text-sm text-neutral-500">
                Loading PDF...
              </div>
            }
            className="flex flex-col items-center"
          >
            <Page
              pageNumber={pageNumber}
              width={fitWidth}
              scale={scale}
              renderTextLayer
              renderAnnotationLayer
              className="mb-4 bg-white shadow-sm last:mb-0"
            />
          </Document>
        )}
      </div>
    </div>
  );
}
