import { ReactNode } from "react";

interface ValueCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  color: "dark" | "aqua"; // Dos variantes de color
}

export function ValueCard({ icon, title, description, color }: ValueCardProps) {
  const colorClasses =
    color === "dark"
      ? "from-(--primary) to-(--primary-light)"
      : "from-(--accent) to-(--accent-hover)";

  const textColor = color === "dark" ? "text-gray-100" : "text-gray-50";

  return (
    <div
      className={`bg-linear-to-br ${colorClasses} transform rounded-2xl p-8 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="mb-4 text-2xl font-bold">{title}</h3>
      <p className={`${textColor} leading-relaxed`}>{description}</p>
    </div>
  );
}
