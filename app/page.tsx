import Link from "next/link";
import ParkCard from "@/components/ParkCard";
import QuickNavigation from "@/components/QuickNavigation";
import FastTravel from "@/components/FastTravel";
import ThemeSettings from "@/components/ThemeSettings";
import SearchBar from "@/components/SearchBar";

function CompassIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="m9 15 2-6 6-2-2 6-6 2Z" />
    </svg>
  );
}

function CocktailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
      <path d="M5 5h14l-7 8-7-8Z" />
      <path d="M12 13v6" />
      <path d="M9 21h6" />
    </svg>
  );
}

function ForkKnifeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
      <path d="M6 3v8" />
      <path d="M9 3v8" />
      <path d="M6 7h3" />
      <path d="M7.5 11v10" />
      <path d="M15 3v8c0 1.1.9 2 2 2V3h-2Z" />
      <path d="M17 13v8" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
      <path d="M12 21s6-6.4 6-11a6 6 0 1 0-12 0c0 4.6 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2" />
    </svg>
  );
}

const parks = [
  {
    id: "magic-kingdom",
    name: "Magic Kingdom",
    slug: "magic-kingdom",
    color: "pill-accent",
    emoji: "🏰",
    image: "/images/magic-kingdom.jpg",
  },
  {
    id: "epcot",
    name: "EPCOT",
    slug: "epcot",
    color: "pill-accent2",
    emoji: "🌍",
    image: "/images/epcot.jpg",
  },
  {
    id: "hollywood-studios",
    name: "Hollywood Studios",
    slug: "hollywood-studios",
    color: "pill-info",
    emoji: "🎬",
    image: "/images/hollywood-studios.jpg",
  },
  {
    id: "animal-kingdom",
    name: "Animal Kingdom",
    slug: "animal-kingdom",
    color: "pill-success",
    emoji: "🦁",
    image: "/images/animal-kingdom.jpg",
  },
];

export default function Home() {
  return (
    <>
      <ThemeSettings />
      <main className="min-h-screen lg:pl-64 bg-bg text-text">
        <QuickNavigation />

      {/* ========================================
           HERO SECTION - Landio Style
           ======================================== */}
      <header className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/magic-kingdom.jpg')] bg-cover bg-center opacity-25" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg/70 to-bg/95" aria-hidden="true" />
        <div className="relative container mx-auto max-w-5xl px-4 py-12 md:py-16 text-center">
          <div className="mb-8 flex justify-center">
            <img src="/logo.jpg" alt="The Goofy Trooper" className="h-56 md:h-72 w-auto object-contain rounded-xl shadow-[0_0_40px_rgba(79,99,255,0.25)]" />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <Link href="/daily-dashboard" className="goofy-cta-button">
              <CompassIcon />
              Walt Disney World Today Dashboard
            </Link>
            <Link href="/goofys-grog-trot" className="goofy-cta-button">
              <CocktailIcon />
              Goofy's Grog Trot
            </Link>
            <Link href="/goofys-grub-grab" className="goofy-cta-button">
              <ForkKnifeIcon />
              Goofy's Grub Grab
            </Link>
            <Link href="/group" className="goofy-cta-button">
              <PinIcon />
              Find Your Group
            </Link>
          </div>
          <div className="mt-6">
            <SearchBar />
          </div>
        </div>
      </header>

      {/* ========================================
           PARKS GRID SECTION - Landio Style
           ======================================== */}
      <div className="container mx-auto px-4 py-10 md:py-12 lg:py-14 max-w-5xl">
        {/* Section header with kicker */}
        <div id="parks-grid" className="section-header">
          <span className="section-eyebrow">PARKS</span>
          <h2 className="section-title">Select a Park</h2>
          <p className="section-subhead">Explore all four Disney World parks</p>
        </div>

        {/* Responsive grid with Landio-style cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {parks.map((park) => (
            <Link key={park.id} href={`/parks/${park.slug}`} className="block">
              <ParkCard park={park} />
            </Link>
          ))}
        </div>

        {/* ========================================
             FAST TRAVEL SECTION - Landio Style
             ======================================== */}
        <div id="fast-travel" className="card-landio card-landio-featured mt-12 md:mt-16">
          {/* Section header with kicker */}
          <div className="section-header">
            <span className="section-eyebrow">FAST TRAVEL</span>
            <h2 className="text-display-xl font-bold font-display text-text mb-2 flex items-center gap-3">
              <span className="text-2xl md:text-3xl">✈️</span>
              Get there fast
            </h2>
            <p className="section-subhead">
              Find the quickest route between Disney locations using monorails, buses, boats, Skyliner, and walking paths.
            </p>
          </div>

          {/* Compact Fast Travel widget */}
          <FastTravel compact={true} />
        </div>

        {/* ========================================
             QUICK TIPS CARD - Landio Style
             ======================================== */}
        <div className="card-landio card-landio-featured mt-12 md:mt-16">
          {/* Section header with kicker */}
          <div className="section-header">
            <span className="section-eyebrow">QUICK TIPS</span>
            <h3 className="text-display-xl font-bold font-display mb-4 flex items-center gap-3">
              <span className="text-2xl md:text-3xl">ℹ️</span>
              Essential Info
            </h3>
          </div>

          {/* Tips list with Landio styling */}
          <ul className="text-base space-y-4">
            <li className="flex items-start gap-3">
              <span className="text-success mt-0.5 text-lg">•</span>
              <span className="text-text-muted">Wait times update every 5 minutes</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent mt-0.5 text-lg">•</span>
              <span className="text-text-muted">Limited edition items marked with ⭐</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-warning mt-0.5 text-lg">•</span>
              <span className="text-text-muted">Popcorn buckets shown with current availability</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent2 mt-0.5 text-lg">•</span>
              <span className="text-text-muted">Use the ⚙️ button to customize your theme!</span>
            </li>
          </ul>
        </div>
      </div>
      </main>
    </>
  );
}
