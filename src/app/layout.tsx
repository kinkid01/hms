import type { Metadata, Viewport } from 'next';
import { DM_Sans } from 'next/font/google';
import React, { ReactNode } from 'react';
import { hospital } from 'config/hospital';
import AppWrappers from './AppWrappers';

// Self-hosted at build time, so it doesn't depend on Google Fonts at runtime.
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${hospital.portalName} · ${hospital.name}`,
  description: 'View your hospital records, download reports and fund your hospital wallet.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#422AFB',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body id={'root'}>
        <AppWrappers>{children}</AppWrappers>
      </body>
    </html>
  );
}
