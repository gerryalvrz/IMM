//images
import BitcoinImage from '@/assets/images/coin/celo-celo-logo.svg';
import TetherImage from '@/assets/images/coin/cmxp.png';
import CardanoImage from '@/assets/images/coin/cmx.png';
import BinanceImage from '@/assets/images/coin/celo dolar.png';

export const coinSlideData = [
  {
    id: '0',
    name: 'Celo',
    symbol: '$CELO',
    balance: '17,890',
    usdBalance: '11,032.24',
    logo: BitcoinImage,
    change: '+12.5%',
    isChangePositive: true,
    color: '#FDEDD4',
  },
  {
    id: '1',
    name: 'Celo Mexican Peso',
    symbol: 'cMxP',
    balance: '10,239',
    usdBalance: '532.24',
    logo: TetherImage,
    change: '-1.5%',
    isChangePositive: false,
    color: '#E1F9F1',
  },
  {
    id: '2',
    name: 'CeloMexico Token',
    symbol: 'CmxT',
    balance: '32,202',
    usdBalance: '632.94',
    logo: CardanoImage,
    change: '+12.5%',
    isChangePositive: true,
    color: '#FBF5D5',
  },
  {
    id: '3',
    name: 'Celo Dolar',
    symbol: 'cUSD',
    balance: '240.55',
    usdBalance: '240.24',
    logo: BinanceImage,
    change: '+1.5%',
    isChangePositive: true,
    color: '#E1F9F1',
  },
];
