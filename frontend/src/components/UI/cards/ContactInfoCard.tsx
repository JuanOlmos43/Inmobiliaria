import { ReactNode } from "react";

interface ContactInfoCardProps {
  icon: ReactNode;
  title: string;
  content: ReactNode; // Puede ser string o JSX (para links, saltos de línea, etc.)
}

export function ContactInfoCard({
  icon,
  title,
  content,
}: ContactInfoCardProps) {
  return (
    <div className="rounded-2xl border-l-4 border-(--accent) bg-white p-6 shadow-lg">
      <div className="flex items-start space-x-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-(--accent)">
          {icon}
        </div>
        <div>
          <h3 className="mb-2 text-xl font-bold text-(--primary)">{title}</h3>
          <div className="text-gray-600">{content}</div>
        </div>
      </div>
    </div>
  );
}
