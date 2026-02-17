import Link from "next/link";
import WaitTimesWithSort from "@/components/WaitTimesWithSort";
import MerchListWithBadges from "@/components/MerchListWithBadges";
import PopcornBucketListWithBadges from "@/components/PopcornBucketListWithBadges";
import ParkHours from "@/components/ParkHours";
import WhatsExcitingRightNowEnhanced from "@/components/WhatsExcitingRightNowEnhanced";
import VirtualQueueReminders from "@/components/VirtualQueueReminders";
import QuickNavigation from "@/components/QuickNavigation";
import ThemeSettings from "@/components/ThemeSettings";

// Park slug to data file mapping
const parkDataMap: { [key: string]: string } = {
  "magic-kingdom": "magic-kingdom-data.json",
  "epcot": "epcot-data.json",
  "hollywood-studios": "hollywood-studios-data.json",
  "animal-kingdom": "animal-kingdom-data.json",
};

// Park display info
const parkInfo: { [key: string]: { name: string; emoji: string; color: string; image: string } } = {
  "magic-kingdom": { name: "Magic Kingdom", emoji: "🏰", color: "pill-accent", image: "/images/magic-kingdom.jpg" },
  "epcot": { name: "EPCOT", emoji: "🌍", color: "pill-accent2", image: "/images/epcot.jpg" },
  "hollywood-studios": { name: "Hollywood Studios", emoji: "🎬", color: "pill-info", image: "/images/hollywood-studios.jpg" },
  "animal-kingdom": { name: "Animal Kingdom", emoji: "🦁", color: "pill-success", image: "/images/animal-kingdom.jpg" },
};

async function getParkData(slug: string) {
  try {
    const fs = require("fs");
    const path = require("path");
    const filePath = path.join(process.cwd(), "data", parkDataMap[slug]);
    const fileContents = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error loading park data:", error);
    return null;
  }
}

export default async function ParkPage({ params }: { params: { slug: string } }) {
  const parkData = await getParkData(params.slug);
  const park = parkInfo[params.slug];

  if (!parkData || !park) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center px-4">
          <h1 className="text-2xl font-bold text-text mb-4">Park Not Found</h1>
          <Link href="/" className="btn-secondary inline-flex items-center gap-2">
            ← Back to Parks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen lg:pl-64 bg-bg text-text">
      <ThemeSettings />
      <QuickNavigation currentPark={park.name} parkSlug={params.slug} />

      {/* ========================================
           HERO BANNER - Landio Style
           ======================================== */}
      <div className="relative h-64 md:h-80 lg:h-96 w-full overflow-hidden border-b border-border">
        <img
          src={park.image}
          alt={park.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-transparent" />

        {/* Back Button */}
        <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10">
          <Link
            href="/"
            className="card-landio-mini btn-ghost inline-flex items-center gap-2"
          >
            ← Back to Parks
          </Link>
        </div>

        {/* Park Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-12">
          <div className="container mx-auto max-w-4xl">
            <h1 className="text-display-2xl md:text-display-3xl lg:text-display-3xl font-bold font-display text-text flex items-center gap-4">
              <span className="text-5xl md:text-6xl lg:text-7xl">{park.emoji}</span>
              {park.name}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-10 lg:py-12 max-w-4xl space-y-8">
        <nav aria-label="Breadcrumb" className="text-sm text-text-muted">
          <Link href="/" className="hover:text-text">Home</Link>
          <span className="mx-2">&gt;</span>
          <span>Parks</span>
          <span className="mx-2">&gt;</span>
          <span className="text-text">{park.name}</span>
        </nav>

        {/* ========================================
             PARK HOURS SECTION
             ======================================== */}
        <ParkHours hours={parkData.parkHours} />

        {/* ========================================
             WHAT'S EXCITING SECTION
             ======================================== */}
        <WhatsExcitingRightNowEnhanced
          content={parkData.whatsExcitingRightNow}
          parkHours={parkData.parkHours}
          nextEvent={parkData.nextEvent}
          weatherStatus={parkData.weatherStatus}
          parkName={park.name}
        />

        {/* ========================================
             VIRTUAL QUEUE REMINDERS
             ======================================== */}
        <VirtualQueueReminders currentPark={park.name} />

        {/* ========================================
             WAIT TIMES SECTION - Landio Style
             ======================================== */}
        <section id="wait-times" className="card-landio card-landio-featured">
          <div className="section-header border-b border-border pb-4">
            <span className="pill-info landio-kicker">LIVE</span>
            <h2 className="text-display-xl font-bold font-display text-text flex items-center gap-3">
              <span className="text-2xl md:text-3xl">⏱️</span>
              Wait Times
            </h2>
            <p className="section-subhead">Real-time attraction wait times</p>
          </div>
          <div className="p-6 md:p-8">
            <WaitTimesWithSort queueTimesId={parkData.queueTimesId} />
          </div>
        </section>

        {/* ========================================
             LIMITED EDITION MERCH SECTION - Landio Style
             ======================================== */}
        <section id="merch" className="card-landio card-landio-featured">
          <div className="section-header border-b border-border pb-4">
            <span className="pill-warning landio-kicker">LIMITED EDITION</span>
            <h2 className="text-display-xl font-bold font-display text-text flex items-center gap-3">
              <span className="text-2xl md:text-3xl">⭐</span>
              Merch
            </h2>
            <p className="section-subhead">Exclusive items available now</p>
          </div>
          <div className="p-6 md:p-8">
            <MerchListWithBadges items={parkData.limitedEditionMerch} />
          </div>
        </section>

        {/* ========================================
             POPCORN BUCKETS SECTION - Landio Style
             ======================================== */}
        <section className="card-landio card-landio-featured">
          <div className="section-header border-b border-border pb-4">
            <span className="pill-success landio-kicker">COLLECTIBLE</span>
            <h2 className="text-display-xl font-bold font-display text-text flex items-center gap-3">
              <span className="text-2xl md:text-3xl">🍿</span>
              Popcorn Buckets
            </h2>
            <p className="section-subhead">Current availability across the park</p>
          </div>
          <div className="p-6 md:p-8">
            <PopcornBucketListWithBadges
              items={parkData.popcornBuckets}
              liveData={true}
              lastUpdated={parkData.popcornBucketsLastUpdated || new Date().toISOString()}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
