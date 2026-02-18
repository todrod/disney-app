import { ReactNode } from 'react';
import QuickNavigation from '@/components/QuickNavigation';

export default function GoofysGrubGrabLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen lg:pl-64 bg-bg text-text">
      <QuickNavigation />
      <div className="container mx-auto max-w-5xl px-4 py-8 md:py-10">{children}</div>
    </main>
  );
}
