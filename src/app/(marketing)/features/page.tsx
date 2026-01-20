import React from 'react';
import FeaturesHero from '@/components/marketing/sections/features/features-hero';
import FeaturesList from '@/components/marketing/sections/features/features-list';
import FeaturesCta from '@/components/marketing/sections/features/features-cta';

const FeaturesPage = () => {
  return (
    <main>
      <FeaturesHero />
      <FeaturesList />
      <FeaturesCta />
    </main>
  );
};

export default FeaturesPage;
