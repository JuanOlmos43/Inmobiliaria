import { ReactNode } from "react";

interface ContactInfoCardProps {
  icon: ReactNode;
  title: string;
  content: ReactNode; // Puede ser string o JSX (para links, saltos de línea, etc.)
}

export default function ContactInfoCard({
  icon,
  title,
  content,
}: ContactInfoCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-(--accent)">
      <div className="flex items-start space-x-4">
        <div className="shrink-0 w-12 h-12 bg-(--accent) rounded-full flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-bold text-(--primary) mb-2">{title}</h3>
          <div className="text-gray-600">{content}</div>
        </div>
      </div>
    </div>
  );
}
