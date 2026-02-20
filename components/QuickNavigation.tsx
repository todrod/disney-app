"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface QuickNavigationProps {
  currentPark?: string;
  parkSlug?: string;
}

type IconProps = {
  className?: string;
};

function HomeIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-5h4v5" />
    </svg>
  );
}

function ClockIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function BagIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M6 8h12l-1 11H7L6 8Z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </svg>
  );
}

function ForkKnifeIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M6 3v8" />
      <path d="M9 3v8" />
      <path d="M6 7h3" />
      <path d="M7.5 11v10" />
      <path d="M15 3v8c0 1.1.9 2 2 2V3h-2Z" />
      <path d="M17 13v8" />
    </svg>
  );
}

function MapIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2V6Z" />
      <path d="M9 4v14" />
      <path d="M15 6v14" />
    </svg>
  );
}

function PlaneIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="m3 11 18-7-7 18-2-8-9-3Z" />
    </svg>
  );
}

function NewspaperIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M4 5h13a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V5Z" />
      <path d="M8 9h8" />
      <path d="M8 13h8" />
      <path d="M8 17h5" />
    </svg>
  );
}

function CocktailIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M5 5h14l-7 8-7-8Z" />
      <path d="M12 13v6" />
      <path d="M9 21h6" />
    </svg>
  );
}

function PinIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M12 21s6-6.4 6-11a6 6 0 1 0-12 0c0 4.6 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2" />
    </svg>
  );
}

function ClipboardIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <rect x="6" y="4" width="12" height="16" rx="2" />
      <path d="M9 4.5h6v3H9z" />
    </svg>
  );
}

export default function QuickNavigation({ currentPark: _currentPark, parkSlug }: QuickNavigationProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isHomepage = !parkSlug;

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [mobileMenuOpen]);

  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: HomeIcon,
      href: "/",
    },
    {
      id: "times",
      label: "Live Times",
      icon: ClockIcon,
      href: parkSlug ? `#wait-times` : "#",
      disabled: isHomepage,
      disabledTitle: "Select a park first to view wait times",
    },
    {
      id: "merch",
      label: "Merch Tracker",
      icon: BagIcon,
      href: parkSlug ? "#merch" : "#",
      disabled: isHomepage,
      disabledTitle: "Select a park first to view merch",
    },
    {
      id: "food",
      label: "Food & Mobile Order",
      icon: ForkKnifeIcon,
      href: "https://disneyworld.disney.go.com/dining/",
      external: true,
    },
    {
      id: "wayfinding",
      label: "Wayfinding",
      icon: MapIcon,
      href: "https://disneyworld.disney.go.com/maps/",
      external: true,
    },
    {
      id: "fast-travel",
      label: "Fast Travel",
      icon: PlaneIcon,
      href: "/fast-travel",
    },
    {
      id: "dashboard",
      label: "Newsletter Dashboard",
      icon: NewspaperIcon,
      href: "/daily-dashboard",
    },
    {
      id: "grog-trot",
      label: "Goofy's Grog Trot",
      icon: CocktailIcon,
      href: "/goofys-grog-trot",
    },
    {
      id: "grub-grab",
      label: "Goofy's Grub Grab",
      icon: ForkKnifeIcon,
      href: "/goofys-grub-grab",
    },
    {
      id: "group",
      label: "Find Your Group",
      icon: PinIcon,
      href: "/group",
    },
    {
      id: "crawl-dashboard",
      label: "Crawl Dashboard",
      icon: ClipboardIcon,
      href: "/dashboard",
    },
  ];

  const isActive = (href: string, external?: boolean) => {
    if (external) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const utilityNavItems = navItems.slice(0, 6);
  const featureNavItems = navItems.slice(6);

  return (
    <>
      {/* Desktop Sidebar - Landio Style */}
      <aside className="hidden lg:block fixed left-0 top-0 h-full w-64 border-r border-border bg-surface shadow-soft z-40 overflow-y-auto">
        <div className="p-6 border-b border-border">
          <Link href="/" className="flex items-center justify-center gap-2 text-display-lg font-bold font-display text-text hover:text-accent transition-colors p-2 rounded-xl hover:bg-surface2">
            <img src="/logo.jpg" alt="The Goofy Trooper" className="h-16 w-auto object-contain max-w-full rounded-lg shadow-soft" />
          </Link>
        </div>

        <nav className="px-4 py-4">
          <p className="px-4 pb-2 text-[11px] uppercase tracking-wider text-text-faint">Utilities</p>
          {utilityNavItems.map((item) => {
            const Icon = item.icon;
            return (
            <div key={item.id} className="mb-2">
              {item.disabled ? (
                <button
                  type="button"
                  disabled
                  title={item.disabledTitle}
                  className="w-full flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-xl opacity-50 cursor-not-allowed text-text-muted"
                >
                  <Icon className="w-5 h-5 text-text-faint" />
                  <p className="font-semibold text-sm text-left">{item.label}</p>
                </button>
              ) : item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-xl transition-all duration-200 ${
                    isActive(item.href, item.external)
                      ? "bg-accent text-text shadow-soft"
                      : "text-text-muted hover:bg-surface2 hover:text-text"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <p className="font-semibold text-sm">
                    {item.label} <span aria-hidden="true">↗</span>
                  </p>
                </a>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-xl transition-all duration-200 ${
                    isActive(item.href)
                      ? "bg-accent text-text shadow-soft"
                      : "text-text-muted hover:bg-surface2 hover:text-text"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <p className="font-semibold text-sm">{item.label}</p>
                </Link>
              )}
            </div>
            );
          })}
          <div className="my-3 border-t border-border" />
          <p className="px-4 pb-2 text-[11px] uppercase tracking-wider text-text-faint">Features</p>
          {featureNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="mb-2">
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-xl transition-all duration-200 ${
                    isActive(item.href) ? "bg-accent text-text shadow-soft" : "text-text-muted hover:bg-surface2 hover:text-text"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <p className="font-semibold text-sm">{item.label}</p>
                </Link>
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Hamburger + Slideout Menu */}
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-[1200] w-12 h-12 rounded-xl border border-border bg-surface shadow-soft text-text text-2xl flex items-center justify-center touch-manipulation"
        onClick={() => setMobileMenuOpen((prev) => !prev)}
        aria-label="Toggle menu"
        aria-expanded={mobileMenuOpen}
      >
        ☰
      </button>

      {mobileMenuOpen && (
        <button
          type="button"
          className="lg:hidden fixed inset-0 bg-black/50 z-[1090]"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close menu overlay"
        />
      )}

      <aside
        className={`lg:hidden fixed top-0 left-0 h-full w-72 max-w-[85vw] border-r border-border bg-surface shadow-med z-[1100] transform transition-transform duration-200 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 border-b border-border flex items-center justify-between">
          <p className="font-bold text-lg text-text">Menu</p>
          <button
            type="button"
            className="w-10 h-10 rounded-lg hover:bg-surface2"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <div key={item.id}>
              {(() => {
                const Icon = item.icon;
                return item.disabled ? (
                  <button
                    type="button"
                    disabled
                    title={item.disabledTitle}
                    className="w-full flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-xl opacity-50 cursor-not-allowed text-text-muted"
                  >
                    <Icon className="w-5 h-5 text-text-faint" />
                    <p className="font-semibold text-sm text-left">{item.label}</p>
                  </button>
                ) : item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-xl text-text-muted hover:bg-surface2 hover:text-text transition-all duration-200"
                    onClick={() => {
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Icon className="w-5 h-5" />
                    <p className="font-semibold text-sm">
                      {item.label} <span aria-hidden="true">↗</span>
                    </p>
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-xl transition-all duration-200 ${
                      isActive(item.href) ? "bg-accent text-text shadow-soft" : "text-text-muted hover:bg-surface2 hover:text-text"
                    }`}
                    onClick={() => {
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Icon className="w-5 h-5" />
                    <p className="font-semibold text-sm">{item.label}</p>
                  </Link>
                );
              })()}
            </div>
          ))}
        </nav>
      </aside>

      {/* Spacer for mobile bottom nav */}
      <div className="lg:hidden h-6" />
    </>
  );
}
