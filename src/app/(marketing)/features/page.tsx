import React from 'react';
import { Metadata } from 'next';
import FeaturesHero from '@/components/marketing/sections/features/features-hero';
import FeaturesList from '@/components/marketing/sections/features/features-list';
import FeaturesCta from '@/components/marketing/sections/features/features-cta';

export const metadata: Metadata = {
  title: 'Features',
  description:
    'Explore powerful features designed to help you read deeper. Note-taking, highlighting, and library management all in one place.',
};

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
