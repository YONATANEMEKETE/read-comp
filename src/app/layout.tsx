import type { Metadata } from 'next';
import { Inter, EB_Garamond } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/marketing/layout/Navbar';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '600', '800', '900'],
  variable: '--font-sans',
  display: 'swap',
});

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Noted - A Quiet Space for Reading',
  description:
    'Read PDFs and write notes without leaving the page. Your thoughts stay connected to the book. A calm reading experience with no context switching.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${ebGaramond.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
