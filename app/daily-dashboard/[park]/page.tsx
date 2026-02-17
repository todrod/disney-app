import ParkDashboard from '@/components/dashboard/ParkDashboard';

export default function DailyDashboardParkPage({ params }: { params: { park: string } }) {
  return <ParkDashboard slug={params.park} />;
}
