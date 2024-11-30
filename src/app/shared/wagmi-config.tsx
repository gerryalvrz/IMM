import { mainnet, sepolia } from 'wagmi/chains';
import { cookieStorage, createStorage } from 'wagmi';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';

export const projectId = process.env.NEXT_PUBLIC_CRYPTO_PROJECT_ID;

const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

const chains = [mainnet, sepolia] as const;
export const config = defaultWagmiConfig({
  chains,
  projectId: projectId || '',
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});
