"use client";

export type StatusVariant = "success" | "warning" | "danger" | "info" | "accent" | "accent2";

interface StatusBadgeProps {
  variant: StatusVariant;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const variantClasses: Record<StatusVariant, string> = {
  success: "pill-success",
  warning: "pill-warning",
  danger: "pill-danger",
  info: "pill-info",
  accent: "pill-accent",
  accent2: "pill-accent2",
};

const sizeClasses = {
  sm: "text-xs px-2 py-1",
  md: "text-sm px-3 py-1.5",
  lg: "text-base px-4 py-2",
};

export default function StatusBadge({
  variant,
  children,
  size = "md",
  className = "",
}: StatusBadgeProps) {
  return (
    <span
      className={`pill-landio ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      role="status"
    >
      {children}
    </span>
  );
}
