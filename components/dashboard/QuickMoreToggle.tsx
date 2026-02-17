"use client";

import { useState } from 'react';

interface QuickMoreToggleProps {
  onToggle: (isMore: boolean) => void;
  isMore: boolean;
}

export default function QuickMoreToggle({ onToggle, isMore }: QuickMoreToggleProps) {
  const handleToggle = () => {
    onToggle(!isMore);
  };

  return (
    <button
      onClick={handleToggle}
      className="card-landio-mini flex items-center gap-3 px-4 py-3 transition-all hover-lift"
      aria-pressed={isMore}
      aria-label={isMore ? 'Switch to Quick mode' : 'Switch to More Magic mode'}
    >
      {/* Magic wand icon */}
      <span
        className={`text-2xl transition-all duration-300 ${
          isMore ? 'scale-110 text-accent' : 'text-text-muted'
        }`}
        aria-hidden="true"
      >
        🪄
      </span>

      {/* Toggle text */}
      <div className="flex flex-col items-start">
        <span className="text-sm font-semibold text-text">
          {isMore ? 'More Magic' : 'Quick'}
        </span>
        <span className="text-xs text-text-muted">
          {isMore ? 'Show expanded details' : 'Quick glance'}
        </span>
      </div>

      {/* Active indicator */}
      {isMore && (
        <span
          className="ml-auto w-2 h-2 bg-accent rounded-full animate-pulse"
          aria-hidden="true"
        />
      )}
    </button>
  );
}
