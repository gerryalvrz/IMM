import CryptocurrencyPricingTable from '@/components/cryptocurrency-pricing-table/cryptocurrency-pricing-table';
import LivePricingSlider from '@/components/ui/live-pricing-slider';

export default function LiveDemo() {
  return (
    <>
      <LivePricingSlider limits={4} />
      <CryptocurrencyPricingTable />
    </>
  );
}
