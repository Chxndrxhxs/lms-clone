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
      className={`flex flex-col p-6 text-white shadow-none ${bg}`}
    >
      <h3 className="text-sm font-bold tracking-tight text-white uppercase">{title}</h3>
      <p className="mt-1.5 flex-1 text-sm text-white/90">{description}</p>
      <button className="mt-5 inline-flex w-fit items-center gap-2 bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition-opacity hover:opacity-90">
        {buttonLabel}
        <ArrowRight size={16} />
      </button>
    </div>
  );
}