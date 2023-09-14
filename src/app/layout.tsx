import { ReactNode } from 'react';
import type { Metadata } from 'next';

import Navbar from '@/components/Navbar';
import { fontSans } from '@/lib/fonts';
import './globals.css';
import { cn } from '@/lib/utils';
import { SiteBlob } from '@/components/SiteBlob';
import { SiteFooter } from '@/components/SiteFooter';
import { Providers } from '@/context';

export const metadata: Metadata = {
  title: 'E commerce app',
  description: 'Here you can buy and sell people',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <Providers>
          <Navbar />
          <SiteBlob />
          <main className="relative flex flex-col">{children}</main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
