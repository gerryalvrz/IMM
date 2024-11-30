import ClassicNFTDetails from '@/components/nft/classic-nft-details';
import { nftData } from '@/data/static/single-nft';

export default function NFTDetailsPageClassic() {
  return <ClassicNFTDetails product={nftData} />;
}
