import { ReactNode } from "react";

interface ValueCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  color: "dark" | "aqua"; // Dos variantes de color
}

export default function ValueCard({
  icon,
  title,
  description,
  color,
}: ValueCardProps) {
  const colorClasses =
    color === "dark"
      ? "from-[#0f172a] to-[#334155]"
      : "from-[#14b8a6] to-[#0d9488]";

  const textColor = color === "dark" ? "text-gray-100" : "text-gray-50";

  return (
    <div
      className={`bg-gradient-to-br ${colorClasses} p-8 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all duration-300 hover:shadow-2xl`}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className={`${textColor} leading-relaxed`}>{description}</p>
    </div>
  );
}
