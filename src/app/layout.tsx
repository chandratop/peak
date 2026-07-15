import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { EXPEDITION } from '@/lib/expedition.config';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['100', '200', '300', '400', '500'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: EXPEDITION.pageTitle,
  description: EXPEDITION.pageDescription,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} font-mono`}>
      <body>{children}</body>
    </html>
  );
}
