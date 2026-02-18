import QuickNavigation from '@/components/QuickNavigation';
import GroupClient from '@/components/goofy-beacon/GroupClient';

export default function GroupByIdPage({ params }: { params: { groupId: string } }) {
  return (
    <main className="min-h-screen lg:pl-64 bg-bg text-text">
      <QuickNavigation />
      <div className="container mx-auto max-w-5xl px-4 py-8 md:py-10">
        <GroupClient initialGroupId={params.groupId} />
      </div>
    </main>
  );
}
