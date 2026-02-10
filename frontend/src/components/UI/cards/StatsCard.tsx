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
      className={`bg-linear-to-br ${color} rounded-xl shadow-lg p-5 text-white transform hover:scale-105 transition-transform duration-300 flex flex-col justify-between whitespace-nowrap`}
    >
      <div className="flex flex-col gap-3">
        <p className="text-xs opacity-80 uppercase tracking-wider font-semibold">
          {title}
        </p>
        <div className="flex items-center gap-3">
          <div className="opacity-90 shrink-0 bg-white/20 p-2 rounded-lg">
            <Icon name={icon} className="w-6 h-6" />
          </div>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
        </div>
      </div>

      {subValue && subValue.length > 0 && (
        <div className="mt-4 pt-3 border-t border-white/20 grid grid-cols-2 gap-2">
          {subValue.map((sub, index) => (
            <div key={index} className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider opacity-70">
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
