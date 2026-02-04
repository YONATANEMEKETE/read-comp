import React from 'react';
import { Metadata } from 'next';
import HeroUseCases from '@/components/marketing/sections/use-cases/hero-use-cases';
import UseCasesList from '@/components/marketing/sections/use-cases/use-cases-list';
import UseCasesCta from '@/components/marketing/sections/use-cases/use-cases-cta';

export const metadata: Metadata = {
  title: 'Use Cases',
  description:
    'Discover how Noted helps students, researchers, and curious readers get more from their reading. From academic papers to personal books.',
};

const UseCasesPage = () => {
  return (
    <main>
      <HeroUseCases />
      <UseCasesList />
      <UseCasesCta />
    </main>
  );
};

export default UseCasesPage;
