import React from 'react';
import HeroUseCases from '@/components/marketing/sections/use-cases/hero-use-cases';
import UseCasesList from '@/components/marketing/sections/use-cases/use-cases-list';
import UseCasesCta from '@/components/marketing/sections/use-cases/use-cases-cta';

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
