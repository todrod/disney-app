'use client';

interface CrowdMeterProps {
  score: number;
  label: string;
  updatedAt: string;
  note?: string;
}

export default function CrowdMeter({ score, label, updatedAt, note }: CrowdMeterProps) {
  const width = `${Math.max(10, Math.min(100, score * 10))}%`;
  const barColor = score >= 8 ? 'bg-danger' : score >= 6 ? 'bg-warning' : 'bg-success';

  return (
    <div className="space-y-2">
      <div className="h-3 w-full bg-surface2 rounded-full overflow-hidden">
        <div
          className={`h-3 ${barColor} transition-all duration-500 ease-out`}
          style={{ width }}
        />
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-text">{label} ({score}/10)</span>
        <span className="text-text-muted">{new Date(updatedAt).toLocaleTimeString()}</span>
      </div>
      {note ? <p className="text-xs text-warning">{note}</p> : null}
    </div>
  );
}
