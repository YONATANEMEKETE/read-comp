import Navbar from '@/components/marketing/layout/Navbar';
import Footer from '@/components/marketing/layout/Footer';

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
