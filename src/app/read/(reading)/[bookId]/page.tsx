'use client';

import { getBookWithProgressAction, updateReadingProgressAction, restartBookAction } from '@/actions/books';
import DetailContent from '@/components/reading/DetailContent';
import { DetailHeader } from '@/components/reading/DetailHeader';
import { BookWithProgress } from '@/types/book';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface ReadingPageProps {
  params: Promise<{
    bookId: string;
  }>;
}

export default function ReadingPage({ params }: ReadingPageProps) {
  const [book, setBook] = useState<BookWithProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [status, setStatus] = useState<'NEW' | 'READING' | 'FINISHED'>('NEW');
  const router = useRouter();
  const queryClient = useQueryClient();
  
  // Refs for managing sync
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSyncedPageRef = useRef<number>(1);
  const bookIdRef = useRef<string>('');
  const totalPagesRef = useRef<number>(0);

  useEffect(() => {
    async function loadBook() {
      try {
        const resolvedParams = await params;
        bookIdRef.current = resolvedParams.bookId;
        const result = await getBookWithProgressAction(resolvedParams.bookId);
        
        if (result.success && result.data) {
          setBook(result.data);
          totalPagesRef.current = result.data.totalPages || 0;
          const initialPage = result.data.userProgress?.progressPage || 1;
          setCurrentPage(initialPage);
          lastSyncedPageRef.current = initialPage;
          setStatus(result.data.userProgress?.status || 'NEW');
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError('Failed to load book data.');
        console.error(err);
      }
    }
    
    loadBook();
  }, [params]);

  // Debounced sync function
  const scheduleSync = useCallback((page: number) => {
    console.log('scheduleSync called for page:', page, 'bookId:', bookIdRef.current);
    
    // Clear any existing timeout
    if (syncTimeoutRef.current) {
      console.log('Clearing existing timeout');
      clearTimeout(syncTimeoutRef.current);
    }

    // Schedule new sync in 5 seconds
    console.log('Setting new 5-second sync timeout');
    syncTimeoutRef.current = setTimeout(async () => {
      console.log('Sync timeout fired! Checking conditions:', {
        page,
        lastSynced: lastSyncedPageRef.current,
        bookId: bookIdRef.current,
        shouldSync: page !== lastSyncedPageRef.current && !!bookIdRef.current
      });
      
      if (page !== lastSyncedPageRef.current && bookIdRef.current) {
        console.log('Starting sync to backend...');
        setIsSaving(true);
        const startTime = Date.now();
        try {
          // Check if on final page
          const isFinalPage = page >= totalPagesRef.current && totalPagesRef.current > 0;
          const result = await updateReadingProgressAction(
            bookIdRef.current, 
            page,
            isFinalPage ? 'FINISHED' : undefined
          );
          console.log('Sync result:', result);
          if (result.success) {
            lastSyncedPageRef.current = page;
          }
        } catch (error) {
          console.error('Failed to sync progress:', error);
        } finally {
          // Ensure "Syncing..." shows for at least 1.5 seconds
          const elapsed = Date.now() - startTime;
          const minDisplayTime = 1500;
          const remaining = Math.max(0, minDisplayTime - elapsed);
          
          setTimeout(() => {
            setIsSaving(false);
          }, remaining);
        }
      } else {
        console.log('Sync skipped - conditions not met');
      }
    }, 5000); // 5 seconds
  }, []);

  // Handle page change from PDF reader
  const handlePageChange = useCallback((page: number) => {
    console.log('handlePageChange called from PDF:', page, '(0-based)');
    // PDF viewer returns 0-based index, convert to 1-based
    const pageNumber = page + 1;
    console.log('Converted to 1-based page:', pageNumber);
    setCurrentPage(pageNumber);
    scheduleSync(pageNumber);
  }, [scheduleSync]);

  // Handle mark as finished
  const handleMarkAsFinished = useCallback(async () => {
    if (!bookIdRef.current) return;
    
    setIsSaving(true);
    try {
      const result = await updateReadingProgressAction(
        bookIdRef.current,
        totalPagesRef.current,
        'FINISHED'
      );
      
      if (result.success) {
        setStatus('FINISHED');
        setCurrentPage(totalPagesRef.current);
        lastSyncedPageRef.current = totalPagesRef.current;
        // Redirect to library page
        router.push('/read');
        // Invalidate queries to refresh book lists
        await queryClient.invalidateQueries({ queryKey: ['user-books'] });
        await queryClient.invalidateQueries({ queryKey: ['favorite-books'] });
      }
    } catch (error) {
      console.error('Failed to mark as finished:', error);
    } finally {
      setIsSaving(false);
    }
  }, [router]);

  // Handle restart book
  const handleRestartBook = useCallback(async () => {
    if (!bookIdRef.current) return;
    
    setIsSaving(true);
    try {
      const result = await restartBookAction(bookIdRef.current);
      
      if (result.success) {
        setStatus('READING');
        setCurrentPage(1);
        lastSyncedPageRef.current = 1;
        // Optionally reload the PDF to page 1
        // Invalidate queries to refresh book lists
        await queryClient.invalidateQueries({ queryKey: ['user-books'] });
        await queryClient.invalidateQueries({ queryKey: ['favorite-books'] });
      }
    } catch (error) {
      console.error('Failed to restart book:', error);
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Immediate sync function for beforeunload
  const immediateSync = useCallback(async () => {
    if (currentPage !== lastSyncedPageRef.current && bookIdRef.current) {
      try {
        // Check if on final page
        const isFinalPage = currentPage >= totalPagesRef.current && totalPagesRef.current > 0;
        await updateReadingProgressAction(
          bookIdRef.current, 
          currentPage,
          isFinalPage ? 'FINISHED' : undefined
        );
        lastSyncedPageRef.current = currentPage;
      } catch (error) {
        console.error('Failed to sync on exit:', error);
      }
    }
  }, [currentPage]);

  // Beforeunload handler
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Use sendBeacon or synchronous XHR for beforeunload
      // For server actions, we'll try the async approach but it may not complete
      immediateSync();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Sync on component unmount
      immediateSync();
      // Clear any pending timeout
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [immediateSync]);

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="h-full w-full flex flex-col overflow-hidden">
        <DetailHeader isLoading={true} />
        <div className="flex-1 overflow-hidden">
          <DetailContent isLoading={true} />
        </div>
      </div>
    );
  }

  // Calculate initial page for PDF viewer (0-based)
  const initialPage = (book.userProgress?.progressPage || 1) - 1;

  return (
    <div className="h-[100dvh] w-full flex flex-col overflow-hidden bg-background">
      <DetailHeader
        title={book.title}
        author={book.author}
        totalPages={book.totalPages}
        currentPage={currentPage}
        isFavorite={book.userProgress?.isFavorite || false}
        isSaving={isSaving}
        onToggleFavorite={() => {}}
        onMarkAsFinished={handleMarkAsFinished}
        onRestartBook={handleRestartBook}
        status={status}
      />
      <div className="flex-1 overflow-hidden relative">
        <DetailContent 
          pdfUrl={book.pdfUrl} 
          initialPage={initialPage}
          onPageChange={handlePageChange}
          bookId={book.id}
        />
      </div>
    </div>
  );
}
