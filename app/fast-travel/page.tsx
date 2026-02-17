import FastTravel from "@/components/FastTravel";
import QuickNavigation from "@/components/QuickNavigation";
import ThemeSettings from "@/components/ThemeSettings";

export default function FastTravelPage() {
  return (
    <>
      <ThemeSettings />
      <main className="min-h-screen lg:pl-64 bg-bg text-text">
        <QuickNavigation />
        <div className="container mx-auto max-w-5xl px-4 py-8 md:py-10 lg:py-12">
          <FastTravel />
        </div>
      </main>
    </>
  );
}

