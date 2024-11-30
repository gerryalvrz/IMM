import RetroNFTDetails from '@/components/nft/retro-nft-details';
import { nftData } from '@/data/static/single-nft';

export default function NFTDetailsPageRetro() {
  return <RetroNFTDetails product={nftData} />;
}
