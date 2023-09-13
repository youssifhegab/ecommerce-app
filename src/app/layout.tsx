import { ReactNode } from 'react';
import type { Metadata } from 'next';

import GlobalState from '@/context';
import Navbar from '@/components/Navbar';
import { fontSans } from '@/lib/fonts';
import './globals.css';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'E commerce app',
  description: 'Here you can buy and sell people',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <GlobalState>
          <Navbar />
          <main className="flex min-h-screen flex-col">{children}</main>
        </GlobalState>
      </body>
    </html>
  );
}
