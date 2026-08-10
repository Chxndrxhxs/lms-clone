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
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className={`rounded-lg p-2.5 ${bg}`}>
          <Icon size={20} className={iconColor} />
        </div>
      </div>
      <p className="mt-3 text-sm text-gray-500">{change}</p>
    </div>
  );
}