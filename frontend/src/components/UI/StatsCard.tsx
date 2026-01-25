import Icon, { IconName } from "./Icon";

interface StatsCardProps {
  title: string;
  value: string | number;
  color: string; // Tailwind gradient classes, ej: "from-blue-500 to-blue-600"
  icon: IconName; // Nombre del icono del componente Icon
}

export default function StatsCard({
  title,
  value,
  color,
  icon,
}: StatsCardProps) {
  return (
    <div
      className={`bg-gradient-to-br ${color} rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300`}
    >
      <div className="flex items-start justify-end mb-3">
        <div className="opacity-80">
          <Icon name={icon} className="w-8 h-8" />
        </div>
      </div>
      <p className="text-sm opacity-90 mb-1">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
