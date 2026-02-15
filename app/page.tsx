import Link from "next/link";
import ParkCard from "@/components/ParkCard";
import QuickNavigation from "@/components/QuickNavigation";
import FastTravel from "@/components/FastTravel";
import ThemeSettings from "@/components/ThemeSettings";

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
      <header className="border-b border-border bg-surface">
        <div className="container mx-auto max-w-5xl px-4 py-12 md:py-16">
          {/* Kicker + Headline + Subhead hierarchy */}
          <div className="mb-8">
            <span className="pill-accent landio-kicker">WELCOME</span>
          </div>
          <div className="mb-6">
            <img src="/logo.jpg" alt="Disney Parks Guide" className="h-40 md:h-48 w-auto object-contain" />
          </div>
          <p className="text-lg md:text-xl text-text-muted leading-relaxed max-w-2xl">
            Your quick reference for merch, wait times & more
          </p>
        </div>
      </header>

      {/* ========================================
           PARKS GRID SECTION - Landio Style
           ======================================== */}
      <div className="container mx-auto px-4 py-10 md:py-12 lg:py-14 max-w-5xl">
        {/* Section header with kicker */}
        <div className="section-header">
          <span className="pill-accent landio-kicker">PARKS</span>
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
        <div className="card-landio card-landio-featured mt-12 md:mt-16">
          {/* Section header with kicker */}
          <div className="section-header">
            <span className="pill-accent2 landio-kicker">FAST TRAVEL</span>
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
            <span className="pill-accent2 landio-kicker">QUICK TIPS</span>
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
