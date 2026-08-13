type MarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  required?: boolean;
};

export function MarkdownEditor({
  value,
  onChange,
  placeholder,
  minHeight = 160,
  required,
}: MarkdownEditorProps) {
  return (
    <div className="border border-[#C9CED3] overflow-hidden">
      <textarea
        required={required}
        className="w-full resize-none outline-none p-4 text-sm text-[#393F41]"
        style={{ minHeight }}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="bg-[#F8F9FA] border-t border-[#D1D5DA] h-5 flex items-center justify-end pr-2">
        <span className="text-[10px] text-[#9AA1A8]">Supports Markdown</span>
      </div>
    </div>
  );
}
