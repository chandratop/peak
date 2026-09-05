import type { Metadata } from 'next';
import '@fontsource/jetbrains-mono/latin-300.css';
import '@fontsource/jetbrains-mono/latin-400.css';
import '@fontsource/jetbrains-mono/latin-500.css';
import './globals.css';

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
    <html lang="en" className="font-mono">
      <body>{children}</body>
    </html>
  );
}
