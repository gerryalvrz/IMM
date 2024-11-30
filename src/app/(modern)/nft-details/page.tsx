import NftDetails from '@/components/nft/nft-details';
import { nftData } from '@/data/static/single-nft';

export default function NFTDetailsPageModern() {
  return <NftDetails product={nftData} />;
}
