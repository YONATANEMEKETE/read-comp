'use client';

import { getBookWithProgressAction } from '@/actions/books';
import DetailContent from '@/components/reading/DetailContent';
import { DetailHeader } from '@/components/reading/DetailHeader';
import { BookWithProgress } from '@/types/book';
import React, { useEffect, useState } from 'react';

interface ReadingPageProps {
  params: Promise<{
    bookId: string;
  }>;
}

export default function ReadingPage({ params }: ReadingPageProps) {
  const [book, setBook] = useState<BookWithProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBook() {
      try {
        const resolvedParams = await params;
        const result = await getBookWithProgressAction(resolvedParams.bookId);
        
        if (result.success && result.data) {
          setBook(result.data);
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

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!book) {
    return null; // Return null as requested (no skeleton UI yet)
  }

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <DetailHeader
        title={book.title}
        author={book.author}
        totalPages={book.totalPages}
        currentPage={book.userProgress?.progressPage || 1}
        isFavorite={book.userProgress?.isFavorite || false}
        onToggleFavorite={() => {}}
      />
      <div className="flex-1 overflow-hidden">
        <DetailContent pdfUrl={book.pdfUrl} />
      </div>
    </div>
  );
}
