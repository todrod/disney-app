import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  icon?: string;
  children: ReactNode;
  kicker?: string;
}

export default function Card({ title, icon, children, kicker }: CardProps) {
  return (
    <section className="card-landio card-landio-featured">
      {(title || kicker) && (
        <header className="section-header border-b border-border pb-3">
          {kicker && <span className="pill-info landio-kicker">{kicker}</span>}
          {title && (
            <h2 className="text-display-xl font-bold font-display text-text flex items-center gap-2">
              {icon ? <span aria-hidden="true">{icon}</span> : null}
              {title}
            </h2>
          )}
        </header>
      )}
      <div className="p-5 md:p-6">{children}</div>
    </section>
  );
}
