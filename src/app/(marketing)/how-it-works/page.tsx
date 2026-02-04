import React from 'react';
import { Metadata } from 'next';
import HeroHow from '@/components/marketing/sections/how-it-works/hero-how';
import Steps from '@/components/marketing/sections/how-it-works/Steps';
import Cta from '@/components/marketing/sections/how-it-works/Cta';

export const metadata: Metadata = {
  title: 'How It Works',
  description:
    'Learn how Noted bridges the gap between reading and note-taking. Get started in minutes and transform your reading workflow.',
};

const HowItWorksPage = () => {
  return (
    <main>
      <HeroHow />
      <Steps />
      <Cta />
    </main>
  );
};

export default HowItWorksPage;
