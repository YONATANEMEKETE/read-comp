'use client';

import { BookWithProgress } from '@/types/book';
import { BookCard } from './BookCard';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useViewStore } from '@/store/useViewStore';
import { cn } from '@/lib/utils';

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
        <div className="flex gap-2">
          <button className="size-9 flex items-center justify-center rounded-full border border-sepia-divider bg-white dark:bg-stone-800 text-stone-400 hover:text-primary transition-all shadow-soft cursor-pointer">
            <ArrowLeft className="h-4.5 w-4.5" />
          </button>
          <button className="size-9 flex items-center justify-center rounded-full border border-sepia-divider bg-white dark:bg-stone-800 text-stone-400 hover:text-primary transition-all shadow-soft cursor-pointer">
            <ArrowRight className="h-4.5 w-4.5" />
          </button>
        </div>
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
