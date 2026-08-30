import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import LiveEffects from '../components/LiveEffects';
import BackButton from '../components/BackButton';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RAKTA | One Donation. One Life. One Community.',
  description: 'Find verified blood donors, request help, and save lives through a secure and privacy-first blood donation network.',
  keywords: ['blood donation', 'donor matching', 'RAKTA', 'emergency blood request'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LiveEffects />
        <BackButton />
        {children}
      </body>
    </html>
  );
}
