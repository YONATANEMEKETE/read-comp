'use client';

import { BookWithProgress } from '@/types/book';
import { BookCard } from './BookCard';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useViewStore } from '@/store/useViewStore';
import { cn } from '@/lib/utils';

import Link from 'next/link';

interface SuggestedListProps {
  books: BookWithProgress[];
}

export function SuggestedList({ books }: SuggestedListProps) {
  const { view } = useViewStore();

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="size-1 w-1 bg-primary rounded-full"></div>
          <h3 className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-[0.2em] font-sans">
            Suggested For You
          </h3>
        </div>
        <Link
          href="/read/explore"
          className="group flex items-center gap-2 text-[10px] font-bold text-primary hover:text-stone-900 dark:hover:text-stone-200 transition-colors uppercase tracking-widest"
        >
          Explore More
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div
        className={cn(
          view === 'grid'
            ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8'
            : 'flex flex-col gap-4',
        )}
      >
        {books.map((book) => (
          <BookCard key={`${book.id}-${view}`} book={book} view={view} />
        ))}
      </div>
    </section>
  );
}
