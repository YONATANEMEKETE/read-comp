import type { Metadata } from 'next';
import Navbar from '@/components/marketing/layout/Navbar';
import Footer from '@/components/marketing/layout/Footer';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://noted.app';

export const metadata: Metadata = {
  title: 'Noted — A quiet space for thoughtful reading.',
  description:
    'Capture notes, save quotes, and build story insights directly beside your books.',
  metadataBase: new URL(baseUrl),
  openGraph: {
    title: 'Noted — A quiet space for thoughtful reading.',
    description:
      'Capture notes, save quotes, and build story insights directly beside your books.',
    siteName: 'Noted',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Noted — A quiet space for thoughtful reading.',
    description:
      'Capture notes, save quotes, and build story insights directly beside your books.',
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
