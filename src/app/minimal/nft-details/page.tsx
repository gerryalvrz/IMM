import MinimalNFTDetails from '@/components/nft/minimal-nft-details';
import { nftData } from '@/data/static/single-nft';

export default function NFTDetailsPageMinimal() {
  return <MinimalNFTDetails product={nftData} />;
}
