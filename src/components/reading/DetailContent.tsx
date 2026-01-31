'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import Loader from '../common/Loader';
import DetailSidebar from './DetailSidebar';

const PdfReader = dynamic(() => import('@/components/reading/PdfReader'), {
  ssr: false,
});

interface DetailContentProps {
  pdfUrl?: string;
  isLoading?: boolean;
  initialPage?: number;
  onPageChange?: (page: number) => void;
  bookId?: string;
}

const DetailContent = ({ pdfUrl, isLoading, initialPage = 0, onPageChange, bookId }: DetailContentProps) => {
  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Reader Main Area - 70% width */}
      <main className="w-[70%] bg-stone-100/50 dark:bg-stone-900/50 flex justify-center items-center overflow-y-auto relative">
        {isLoading || !pdfUrl ? (
          <Loader size="lg" />
        ) : (
          <PdfReader 
            fileUrl={pdfUrl} 
            initialPage={initialPage}
            onPageChange={onPageChange}
          />
        )}
      </main>

      {/* Side Panel for Notes/Quotes/Stories - 30% width */}
      <div className="w-[30%]">
        <DetailSidebar bookId={bookId} />
      </div>
    </div>
  );
};

export default DetailContent;
