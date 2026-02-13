"use client";

import { ReactNode } from "react";
import { Icon } from "../icons/Icon";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="rounded-xl bg-white p-12 text-center shadow-lg">
      {/* Icon */}
      {icon ? (
        <div className="mx-auto mb-4 h-16 w-16 text-gray-400">{icon}</div>
      ) : (
        <Icon name="home" className="mx-auto mb-4 h-16 w-16 text-gray-400" />
      )}

      {/* Title */}
      <h3 className="mb-2 text-xl font-semibold text-gray-700">{title}</h3>

      {/* Description */}
      <p className="mb-6 text-gray-500">{description}</p>
    </div>
  );
}
