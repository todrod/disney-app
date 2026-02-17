"use client";

interface CrowdMeterProps {
  value: number; // 1-10 scale
  label: string;
}

export default function CrowdMeter({ value, label }: CrowdMeterProps) {
  // Determine color based on crowd level
  const getColor = (val: number) => {
    if (val <= 3) return 'bg-success';
    if (val <= 6) return 'bg-warning';
    return 'bg-danger';
  };

  return (
    <div className="flex flex-col gap-1" role="meter" aria-valuenow={value} aria-valuemin={0} aria-valuemax={10} aria-label={`Crowd level: ${label}`}>
      {/* Scale bar */}
      <div className="flex gap-0.5 h-2">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className={`flex-1 rounded-sm transition-all ${
              i < value ? getColor(value) : 'bg-surface3'
            }`}
            aria-hidden="true"
          />
        ))}
      </div>
      {/* Label */}
      <span className="text-xs text-text-muted font-medium">{label}</span>
    </div>
  );
}
