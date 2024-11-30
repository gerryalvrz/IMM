import cn from '@/utils/cn';
import { Suspense } from 'react';
import { fira_code } from './fonts';
import type { Metadata } from 'next';
import WalletProvider from './shared/wallet-provider';
import { ThemeProvider } from '@/app/shared/theme-provider';
import { QueryProvider } from './shared/query-client-provider';
import ModalsContainer from '@/components/modal-views/container';
import DrawersContainer from '@/components/drawer-views/container';
import SettingsButton from '@/components/settings/settings-button';
import SettingsDrawer from '@/components/settings/settings-drawer';
// base css file
import 'overlayscrollbars/overlayscrollbars.css';
import 'swiper/css';
import 'swiper/css/pagination';
import '@/assets/css/scrollbar.css';
import '@/assets/css/globals.css';
import '@/assets/css/range-slider.css';

export const metadata: Metadata = {
  title: 'Criptic',
  description: 'Criptic - React Next Web3 NFT Crypto Dashboard Template',
  icons: {
    icon: {
      url: '/favicon.ico',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={cn('light', fira_code.className)}
      suppressHydrationWarning
    >
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1 maximum-scale=1"
        />
      </head>
      <body suppressHydrationWarning>
        <WalletProvider>
          <QueryProvider>
            <ThemeProvider>
              <SettingsButton />
              <SettingsDrawer />
              <Suspense fallback={null}>
                <ModalsContainer />
                <DrawersContainer />
              </Suspense>
              {children}
            </ThemeProvider>
          </QueryProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
