"use client";

import Link from "next/link";
import Image from "next/image";
import Navigation from "./Navigation";
import ThemeToggle from "./ThemeToggle";
import ThemeSettingsDrawer from "./ThemeSettingsDrawer";

export default function Header() {
  return (
    <header className="nav-landio bg-bg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4 py-3 md:py-4">
          {/* Left: Logo + Name */}
          <Link
            href="/"
            className="flex items-center gap-3 group transition-transform duration-200 hover:scale-105"
          >
            <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full bg-surface2 border border-border overflow-hidden shadow-soft flex-shrink-0">
              <Image
                src="/images/The-Goofy-Trooper.jpg"
                alt="The Goofy Trooper Logo"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 40px, 48px"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-text font-bold text-base md:text-lg leading-tight font-display">
                The Goofy Trooper
              </span>
              <span className="text-text-muted text-xs md:text-sm leading-tight">
                Disney Day Planner
              </span>
            </div>
          </Link>

          {/* Right: Navigation + Toggles */}
          <div className="flex items-center gap-2 md:gap-4 flex-wrap justify-end">
            <Navigation />
            <ThemeToggle />
            <ThemeSettingsDrawer />
          </div>
        </div>
      </div>
    </header>
  );
}
