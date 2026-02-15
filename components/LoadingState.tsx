"use client";

interface LoadingStateProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-4 h-4 border-2",
  md: "w-8 h-8 border-3",
  lg: "w-12 h-12 border-4",
};

export default function LoadingState({ message, size = "md" }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12" role="status" aria-live="polite">
      <div
        className={`${sizeClasses[size]} border-t-accent border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin`}
        aria-hidden="true"
      />
      {message && (
        <p className="mt-4 text-sm text-text-muted" aria-live="polite">
          {message}
        </p>
      )}
    </div>
  );
}
