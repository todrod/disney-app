"use client";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`card-landio-mini text-center py-12 ${className}`} role="region" aria-live="polite">
      {icon && <div className="text-text-muted mb-4">{icon}</div>}
      <h3 className="text-lg font-semibold text-text mb-2">{title}</h3>
      {description && <p className="text-text-muted mb-6">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
}
