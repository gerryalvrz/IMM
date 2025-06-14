import { Bitcoin } from '@/components/icons/bitcoin';
import { Tether } from '@/components/icons/tether';
import { Bnb } from '@/components/icons/bnb';
import { Cardano } from '@/components/icons/cardano';

export const walletCurrencies = [
  {
    icon: <Bitcoin />,
    name: 'Bitcoin',
    code: 'BTC',
    volume: '+12.5%',
    color: '#F79517',
    isChangePositive: true,
  },
  {
    icon: <Tether />,
    name: 'Celo Dolar',
    code: 'USDT',
    volume: '-8.47%',
    color: '#259C77',
    isChangePositive: false,
  },
  {
    icon: <Tether />,
    name: 'Celo MxP',
    code: 'ADA',
    volume: '+5.63%',
    color: '#3468D1',
    isChangePositive: true,
  },
  {
    icon: <Bnb />,
    name: 'Celo',
    code: 'BNB',
    volume: '-3.02%',
    color: '#F3BA2F',
    isChangePositive: false,
  },
];
