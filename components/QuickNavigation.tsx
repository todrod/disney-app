"use client";

import { useState } from "react";
import Link from "next/link";

interface QuickNavigationProps {
  // Props kept for compatibility, though not currently used
  currentPark?: string;
  parkSlug?: string;
}

export default function QuickNavigation({ currentPark, parkSlug }: QuickNavigationProps) {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isHomepage = !parkSlug;

  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: "🏠",
      href: "/",
    },
    {
      id: "times",
      label: "Live Times",
      icon: "⏱️",
      href: parkSlug ? `#wait-times` : "#",
      disabled: isHomepage,
      disabledTitle: "Select a park first to view wait times",
    },
    {
      id: "merch",
      label: "Merch Tracker",
      icon: "🛍️",
      href: parkSlug ? "#merch" : "#",
      disabled: isHomepage,
      disabledTitle: "Select a park first to view merch",
    },
    {
      id: "food",
      label: "Food & Mobile Order",
      icon: "🍔",
      href: "https://disneyworld.disney.go.com/dining/",
      external: true,
    },
    {
      id: "wayfinding",
      label: "Wayfinding",
      icon: "🗺️",
      href: "https://disneyworld.disney.go.com/maps/",
      external: true,
    },
    {
      id: "fast-travel",
      label: "Fast Travel",
      icon: "✈️",
      href: "/fast-travel",
    },
    {
      id: "dashboard",
      label: "Newsletter Dashboard",
      icon: "📰",
      href: "/daily-dashboard",
    },
    {
      id: "grub-grab",
      label: "Goofy's Grub Grab",
      icon: "🍴",
      href: "/goofys-grub-grab",
    },
  ];

  return (
    <>
      {/* Desktop Sidebar - Landio Style */}
      <aside className="hidden lg:block fixed left-0 top-0 h-full w-64 border-r border-border bg-surface shadow-soft z-40 overflow-y-auto">
        <div className="p-6 border-b border-border">
          <Link href="/" className="flex items-center justify-center gap-2 text-display-lg font-bold font-display text-text hover:text-accent transition-colors p-2 rounded-xl hover:bg-surface2">
            <img src="/logo.jpg" alt="Disney Parks Guide" className="h-16 w-auto object-contain max-w-full" />
          </Link>
        </div>

        <nav className="px-4 py-4">
          {navItems.map((item) => (
            <div key={item.id} className="mb-2">
              {item.disabled ? (
                <button
                  type="button"
                  disabled
                  title={item.disabledTitle}
                  className="w-full flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-xl opacity-50 cursor-not-allowed text-text-muted"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <p className="font-semibold text-sm text-left">{item.label}</p>
                </button>
              ) : item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-xl transition-all duration-200 ${
                    activeTab === item.id
                      ? "bg-accent text-text shadow-soft"
                      : "text-text-muted hover:bg-surface2 hover:text-text"
                  }`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <p className="font-semibold text-sm">
                    {item.label} <span aria-hidden="true">↗</span>
                  </p>
                </a>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-xl transition-all duration-200 ${
                    activeTab === item.id
                      ? "bg-accent text-text shadow-soft"
                      : "text-text-muted hover:bg-surface2 hover:text-text"
                  }`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <p className="font-semibold text-sm">{item.label}</p>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Mobile Hamburger + Slideout Menu */}
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-50 w-12 h-12 rounded-xl border border-border bg-surface shadow-soft text-text text-2xl flex items-center justify-center"
        onClick={() => setMobileMenuOpen((prev) => !prev)}
        aria-label="Toggle menu"
        aria-expanded={mobileMenuOpen}
      >
        ☰
      </button>

      {mobileMenuOpen && (
        <button
          type="button"
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close menu overlay"
        />
      )}

      <aside
        className={`lg:hidden fixed top-0 left-0 h-full w-72 max-w-[85vw] border-r border-border bg-surface shadow-med z-50 transform transition-transform duration-200 ${
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
              {item.disabled ? (
                <button
                  type="button"
                  disabled
                  title={item.disabledTitle}
                  className="w-full flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-xl opacity-50 cursor-not-allowed text-text-muted"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <p className="font-semibold text-sm text-left">{item.label}</p>
                </button>
              ) : item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-xl text-text-muted hover:bg-surface2 hover:text-text transition-all duration-200"
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <p className="font-semibold text-sm">
                    {item.label} <span aria-hidden="true">↗</span>
                  </p>
                </a>
              ) : (
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-xl text-text-muted hover:bg-surface2 hover:text-text transition-all duration-200"
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <p className="font-semibold text-sm">{item.label}</p>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Spacer for mobile bottom nav */}
      <div className="lg:hidden h-6" />
    </>
  );
}
