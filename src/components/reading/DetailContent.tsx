'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import Loader from '../common/Loader';
import DetailSidebar from './DetailSidebar';
import { Button } from '@/components/ui/button';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-full w-full overflow-hidden relative">
      {/* Reader Main Area */}
      <main className={cn(
        "flex-1 bg-stone-100/50 dark:bg-stone-900/50 relative transition-all duration-300",
        "lg:w-[70%] lg:flex-none",
        isSidebarOpen ? "hidden sm:flex" : "flex"
      )}>
        {isLoading || !pdfUrl ? (
          <Loader size="lg" />
        ) : (
          <PdfReader 
            fileUrl={pdfUrl} 
            initialPage={initialPage}
            onPageChange={onPageChange}
          />
        )}

        {/* Floating Sidebar Toggle - Only visible on Mobile/Tablet */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute bottom-6 right-6 lg:hidden z-40 rounded-full shadow-lg border border-border/50 cursor-pointer"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <PanelRightClose size={20} /> : <PanelRightOpen size={20} />}
        </Button>
      </main>

      {/* Side Panel for Notes/Quotes/Stories */}
      <div className={cn(
        "fixed inset-y-0 right-0 z-30 w-full sm:w-96 bg-background border-l border-border transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:w-[30%] lg:flex-none",
        isSidebarOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <DetailSidebar bookId={bookId} />
      </div>

      {/* Mobile Overlay for Sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DetailContent;
