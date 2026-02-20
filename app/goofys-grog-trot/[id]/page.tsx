import QuickNavigation from '@/components/QuickNavigation';
import CrawlDetailClient from '@/components/grog-trot/CrawlDetailClient';

export default function GrogTrotCrawlPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen lg:pl-64 bg-bg text-text">
      <QuickNavigation />
      <div className="container mx-auto max-w-5xl px-4 py-8 md:py-10 space-y-6">
        <section className="card-landio card-landio-featured text-center">
          <p className="text-3xl md:text-4xl font-bold font-display mb-2">🍹 Goofy's Grog Trot</p>
          <p className="text-text-muted">Shared crawl view</p>
        </section>

        <CrawlDetailClient crawlId={params.id} />
      </div>
    </main>
  );
}
