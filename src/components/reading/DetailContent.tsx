'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import Loader from '../common/Loader';

const PdfReader = dynamic(() => import('@/components/reading/PdfReader'), {
  ssr: false,
});

interface DetailContentProps {
  pdfUrl?: string;
  isLoading?: boolean;
}

const DetailContent = ({ pdfUrl, isLoading }: DetailContentProps) => {
  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Reader Main Area */}
      <main className="flex-1 bg-stone-100/50 dark:bg-stone-900/50 flex justify-center items-center overflow-y-auto relative">
        {isLoading || !pdfUrl ? (
          <Loader size="lg" />
        ) : (
          <PdfReader fileUrl={pdfUrl} />
        )}
      </main>

      {/* Side Panel for Notes/Quotes/Stories */}
      <aside className="w-[450px] bg-white dark:bg-sidebar-dark border-l border-sepia-divider dark:border-stone-800 flex flex-col shadow-soft z-20"></aside>
    </div>
  );
};

export default DetailContent;
