import { Icon } from "../icons/Icon";
import type { IconName } from "../icons/Icon";

interface StatsCardProps {
  title: string;
  value: string | number;
  color: string; // Tailwind gradient classes, ej: "from-blue-500 to-blue-600"
  icon: IconName; // Nombre del icono del componente Icon
  subValue?: {
    label: string;
    value: string | number;
  }[];
}

export function StatsCard({
  title,
  value,
  color,
  icon,
  subValue,
}: StatsCardProps) {
  return (
    <div
      className={`bg-linear-to-br ${color} flex transform flex-col justify-between rounded-xl p-5 whitespace-nowrap text-white shadow-lg`}
    >
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold tracking-wider uppercase opacity-80">
          {title}
        </p>
        <div className="flex items-center gap-3">
          <div className="shrink-0 rounded-lg bg-white/20 p-2 opacity-90">
            <Icon name={icon} className="h-6 w-6" />
          </div>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
        </div>
      </div>

      {subValue && subValue.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/20 pt-3">
          {subValue.map((sub, index) => (
            <div key={index} className="flex flex-col">
              <span className="text-[10px] tracking-wider uppercase opacity-70">
                {sub.label}
              </span>
              <span className="text-sm font-semibold">+{sub.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
