import type { LucideIcon } from "lucide-react";

type StatsCardProps = {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
  bg: string;
  iconColor: string;
};

export function StatsCard({
  label,
  value,
  change,
  icon: Icon,
  bg,
  iconColor,
}: StatsCardProps) {
  return (
    <div className="border border-neutral-200 bg-white p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">{label}</p>
          <p className="mt-2 text-3xl font-bold text-neutral-900">{value}</p>
        </div>
        <div className={`p-2 ${bg}`}>
          <Icon size={20} className={iconColor} />
        </div>
      </div>
      <p className="mt-3 text-sm text-neutral-600">{change}</p>
    </div>
  );
}