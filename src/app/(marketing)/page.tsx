import LandingHero from '@/components/marketing/sections/LandingHero';
import LandingFeatures from '@/components/marketing/sections/LandingFeatures';
import LandingCta from '@/components/marketing/sections/LandingCta';

export default function Home() {
  return (
    <main>
      <LandingHero />
      <LandingFeatures />
      <LandingCta />
    </main>
  );
}
