import type { DashboardRenderModel } from '@/lib/dashboard/types';

interface HeadlinesListProps {
  items: DashboardRenderModel['home']['topStories'] | DashboardRenderModel['parks']['MK']['headlines'];
  expanded: boolean;
}

const ICONS: Record<string, string> = {
  event_alert: '📣',
  limited_merch: '🛍️',
  crowds: '👥',
  entertainment: '🎭',
  food: '🍽️',
  other: 'ℹ️',
};

export default function HeadlinesList({ items, expanded }: HeadlinesListProps) {
  if (!items.length) return null;

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.id} className="card-landio-mini p-4">
          <p className="text-xs text-text-muted mb-2">{ICONS[item.category]} {item.category.replace('_', ' ')}</p>
          <p className="font-semibold text-text">{item.short}</p>
          <p className="text-sm text-text-muted mt-2">{expanded ? item.long : item.short}</p>
        </li>
      ))}
    </ul>
  );
}
