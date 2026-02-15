"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/#live-times", label: "Live Times", icon: "⏱️" },
  { href: "/#merch", label: "Merch Tracker", icon: "🛍️" },
  { href: "/#food", label: "Food & Mobile Order", icon: "🍔" },
  { href: "/#wayfinding", label: "Wayfinding", icon: "🗺️" },
  { href: "/fast-travel", label: "Fast Travel", icon: "✈️" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-2 md:gap-4 flex-wrap" role="navigation" aria-label="Main navigation">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              nav-link flex items-center gap-2 px-4 py-2 rounded-lg text-sm md:text-base
              transition-all duration-150 min-h-[40px] min-w-[40px]
              ${isActive
                ? "text-text bg-surface2 border border-border"
                : "text-text-muted hover:text-text hover:bg-surface2"
              }
            `}
            aria-current={isActive ? "page" : undefined}
          >
            <span className="text-lg" aria-hidden="true">{item.icon}</span>
            <span className="hidden md:inline">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
