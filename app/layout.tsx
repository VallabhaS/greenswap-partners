import type { Metadata } from 'next';
import { DM_Sans, Fraunces } from 'next/font/google';
import './globals.css';

const sans = DM_Sans({ variable: '--font-sans-brand', subsets: ['latin'] });
const display = Fraunces({ variable: '--font-display', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GreenSwap — clearer choices while you shop',
  description: 'See the evidence behind everyday products and find a greener option without raising your budget.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${sans.variable} ${display.variable}`}>{children}</body></html>;
}
