"use client";

import { useState } from "react";
import Link from "next/link";

interface QuickNavigationProps {
  currentPark?: string;
  parkSlug?: string;
}

export default function QuickNavigation({ currentPark, parkSlug }: QuickNavigationProps) {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const navItems = [
    {
      id: "times",
      label: "Live Times",
      icon: "🕐",
      href: parkSlug ? `#wait-times` : "/",
    },
    {
      id: "merch",
      label: "Merch Tracker",
      icon: "🛍️",
      href: parkSlug ? `#merch` : "/",
    },
    {
      id: "food",
      label: "Food & Mobile Order",
      icon: "🍴",
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
  ];

  return (
    <>
      {/* Desktop Sidebar - Landio Style */}
      <aside className="hidden lg:block fixed left-0 top-0 h-full w-64 border-r border-border bg-surface shadow-soft z-40">
        <div className="p-6 border-b border-border">
          <Link href="/" className="flex items-center justify-center gap-2 text-display-lg font-bold font-display text-text hover:text-accent transition-colors p-2 rounded-xl hover:bg-surface2">
            <img src="/logo.jpg" alt="Disney Parks Guide" className="h-36 w-auto object-contain max-w-full" />
          </Link>
        </div>

        <nav className="px-4 py-4">
          {navItems.map((item) => (
            <div key={item.id} className="mb-2">
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                    activeTab === item.id
                      ? "bg-accent text-text shadow-soft"
                      : "text-text-muted hover:bg-surface2 hover:text-text"
                  }`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <p className="font-semibold text-sm">{item.label}</p>
                </a>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
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

      {/* Mobile Bottom Navigation - Landio Style */}
      {/* Updated: Icons only, no text labels */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-surface shadow-med z-50">
        <div className="flex items-center justify-around px-2 py-3">
          {navItems.map((item) => (
            <div key={item.id} className="flex-1 text-center">
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-xl transition-all duration-200 ${
                    activeTab === item.id
                      ? "bg-surface2 text-accent"
                      : "text-text-muted hover:bg-surface2 hover:text-text"
                  }`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <span className="text-3xl">{item.icon}</span>
                </a>
              ) : (
                <Link
                  href={item.href}
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-xl transition-all duration-200 ${
                    activeTab === item.id
                      ? "bg-surface2 text-accent"
                      : "text-text-muted hover:bg-surface2 hover:text-text"
                  }`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <span className="text-3xl">{item.icon}</span>
                </Link>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Spacer for mobile bottom nav */}
      <div className="lg:hidden h-20" />
    </>
  );
}
