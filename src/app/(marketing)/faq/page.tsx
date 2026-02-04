import React from 'react';
import { Metadata } from 'next';
import Faq from '@/components/marketing/sections/faq/faq';

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Find answers to common questions about Noted. Learn how to make the most of your reading experience.',
};

const FaqPage = () => {
  return (
    <main>
      <Faq />
    </main>
  );
};

export default FaqPage;
