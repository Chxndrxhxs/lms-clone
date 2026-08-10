import { ArrowRight } from "lucide-react";

type ActionCardProps = {
  title: string;
  description: string;
  buttonLabel: string;
  bg: string;
};

export function ActionCard({
  title,
  description,
  buttonLabel,
  bg,
}: ActionCardProps) {
  return (
    <div
      className={`flex flex-col rounded-lg p-6 text-white shadow-sm ${bg}`}
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1.5 flex-1 text-sm text-white/80">{description}</p>
      <button className="mt-5 inline-flex w-fit items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-900 transition-opacity hover:opacity-90">
        {buttonLabel}
        <ArrowRight size={16} />
      </button>
    </div>
  );
}