import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['100', '200', '300', '400', '500'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'PEAK',
    template: '%s | PEAK',
  },
  description: 'Tactical mountaineering expedition dashboard',
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
