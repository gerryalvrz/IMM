import type { Metadata } from 'next';
import VestingDashboard from '@/components/vesting/vesting-dashboard';

export const metadata: Metadata = {
  title: 'Vesting Schedules | ImpactMarketMaker',
  description: 'View and claim your vested tokens',
};

export default function VestingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <VestingDashboard />
    </div>
  );
}
