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
    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
      {/* Icon */}
      {icon ? (
        <div className="w-16 h-16 mx-auto text-gray-400 mb-4">{icon}</div>
      ) : (
        <Icon name="home" className="w-16 h-16 mx-auto text-gray-400 mb-4" />
      )}

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>

      {/* Description */}
      <p className="text-gray-500 mb-6">{description}</p>

      {/* Action Button */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-(--primary) hover:bg-(--primary-light) text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 inline-flex items-center justify-center gap-2"
        >
          {actionIcon && actionIcon}
          {actionLabel}
        </button>
      )}
    </div>
  );
}
