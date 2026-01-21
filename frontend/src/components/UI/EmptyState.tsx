'use client';

import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: ReactNode;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon
}: EmptyStateProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
      {/* Icon */}
      {icon ? (
        <div className="w-16 h-16 mx-auto text-gray-400 mb-4">
          {icon}
        </div>
      ) : (
        <svg
          className="w-16 h-16 mx-auto text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      )}

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-500 mb-6">
        {description}
      </p>

      {/* Action Button */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-[#0f172a] hover:bg-[#334155] text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 inline-flex items-center justify-center gap-2"
        >
          {actionIcon && actionIcon}
          {actionLabel}
        </button>
      )}
    </div>
  );
}
