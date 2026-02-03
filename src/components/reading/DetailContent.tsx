'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
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

const DetailContent = ({
  pdfUrl,
  isLoading,
  initialPage = 0,
  onPageChange,
  bookId,
}: DetailContentProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const currentPageRef = useRef(initialPage);
  
  // Open sidebar by default on large screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      }
    };
    
    // Check initial size
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    currentPageRef.current = page;
    onPageChange?.(page);
  }, [onPageChange]);

  return (
    <div className="flex h-full w-full overflow-hidden relative">
      {/* Reader Main Area */}
      <main
        className={cn(
          'flex-1 bg-stone-100/50 dark:bg-stone-900/50 relative transition-all duration-300',
          // When sidebar is closed on large screens, take full width. When open, take 70%
          'lg:flex-none',
          isSidebarOpen ? 'lg:w-[70%] -translate-x-full sm:translate-x-0 opacity-0 sm:opacity-100 pointer-events-none sm:pointer-events-auto' : 'lg:w-full translate-x-0 opacity-100',
        )}
      >
        {isLoading || !pdfUrl ? (
          <Loader size="lg" />
        ) : (
          <PdfReader
            fileUrl={pdfUrl}
            initialPage={currentPageRef.current}
            onPageChange={handlePageChange}
          />
        )}

        {/* Floating Sidebar Toggle - Always visible */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute bottom-6 right-6 z-40 rounded-full shadow-lg border border-border/50 cursor-pointer"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? (
            <PanelRightClose size={20} />
          ) : (
            <PanelRightOpen size={20} />
          )}
        </Button>
      </main>

      {/* Side Panel for Notes/Quotes/Stories */}
      <div
        className={cn(
          'fixed inset-y-0 right-0 z-30 w-full sm:w-96 bg-background border-l border-border transform transition-transform duration-300 ease-in-out lg:relative lg:w-[30%] lg:flex-none',
          // Toggle on all screen sizes
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <DetailSidebar bookId={bookId} onClose={() => setIsSidebarOpen(false)} />
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
