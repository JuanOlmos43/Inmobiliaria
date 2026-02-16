import { Icon } from "@/components/ui";
import type { IconName } from "@/components/ui/icons/Icon";

interface RoleCardProps {
  title: string;
  value: number;
  color: string;
  icon: IconName;
}

export function RoleCard({ title, value, color, icon }: RoleCardProps) {
  return (
    <div
      className={`flex items-center gap-4 rounded-xl bg-linear-to-br p-5 text-white shadow-lg ${color}`}
    >
      <div className="shrink-0 rounded-lg border border-white/20 bg-white/20 p-3">
        <Icon name={icon} className="h-8 w-8 text-white" />
      </div>
      <div>
        <p className="text-xs font-semibold tracking-wider uppercase">
          {title}
        </p>
        <p className="text-3xl font-bold tracking-tight">{value}</p>
      </div>
    </div>
  );
}
