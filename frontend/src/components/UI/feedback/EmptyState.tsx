"use client";

import { ReactNode } from "react";
import { Icon } from "../icons/Icon";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon,
}: EmptyStateProps) {
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

      {/* Action Button */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex transform items-center justify-center gap-2 rounded-full bg-(--primary) px-8 py-3 font-bold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-(--primary-light) hover:shadow-2xl"
        >
          {actionIcon && actionIcon}
          {actionLabel}
        </button>
      )}
    </div>
  );
}
