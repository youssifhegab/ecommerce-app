'use client';

import { CartProvider } from 'use-shopping-cart';

import { Toaster } from '@/components/UIComponents/Toaster';
import { TailwindIndicator } from '@/components/TailwindIndicator';
import GlobalState from './GlobalState';
import { ThemeProvider } from './ThemeProvider';

export function Providers({ children }) {
  return (
    <CartProvider currency="USD" shouldPersist cartMode="checkout-session" stripe={process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <GlobalState>
          <Toaster />
          {children}
          <TailwindIndicator />
        </GlobalState>
      </ThemeProvider>
    </CartProvider>
  );
}
