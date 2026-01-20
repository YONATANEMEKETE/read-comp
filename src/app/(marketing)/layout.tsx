import type { Metadata } from 'next';
import Navbar from '@/components/marketing/layout/Navbar';
import Footer from '@/components/marketing/layout/Footer';

export const metadata: Metadata = {
  title: 'Noted — A quiet space for thoughtful reading.',
  description:
    'Capture notes, save quotes, and build story insights directly beside your books.',
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
