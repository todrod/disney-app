'use client';

interface ToggleProps {
  expanded: boolean;
  onChange: (next: boolean) => void;
}

export default function Toggle({ expanded, onChange }: ToggleProps) {
  return (
    <div className="inline-flex rounded-xl border border-border bg-surface2 p-1 min-h-[44px]">
      <button
        type="button"
        className={`px-4 py-2 rounded-lg text-sm font-semibold min-h-[44px] ${!expanded ? 'bg-surface text-text shadow-soft' : 'text-text-muted'}`}
        onClick={() => onChange(false)}
      >
        Quick
      </button>
      <button
        type="button"
        className={`px-4 py-2 rounded-lg text-sm font-semibold min-h-[44px] ${expanded ? 'bg-surface text-text shadow-soft' : 'text-text-muted'}`}
        onClick={() => onChange(true)}
      >
        More Magic
      </button>
    </div>
  );
}
