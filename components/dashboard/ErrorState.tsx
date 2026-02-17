/**
 * ErrorState Component
 * Displays error message with retry option
 */

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4" aria-hidden="true">
          😕
        </div>
        <h2 className="text-xl font-semibold text-text mb-2">
          Oops! Something went wrong
        </h2>
        <p className="text-sm text-text-muted mb-6">
          {message}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
