'use client';

import { BookWithProgress } from '@/types/book';
import { BookCard } from './BookCard';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface YourListProps {
  books: BookWithProgress[];
}

export function YourList({ books }: YourListProps) {
  const searchParams = useSearchParams();
  const view = (searchParams.get('view') as 'grid' | 'list') || 'grid';

  return (
    <section className="mb-14">
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col gap-1">
          <h3 className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-[0.2em] font-sans">
            Your Library
          </h3>
        </div>

        <Link
          href="/read/your-libraries"
          className="group flex items-center gap-2 text-[10px] font-bold text-primary hover:text-stone-900 dark:hover:text-stone-200 transition-colors uppercase tracking-widest"
        >
          View All
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
          <BookCard key={book.id} book={book} view={view} />
        ))}

        {view === 'grid' && (
          <div className="flex flex-col opacity-60">
            <div className="aspect-3/4 w-full rounded-2xl border-2 border-dashed border-sepia-divider mb-4 flex flex-col items-center justify-center group cursor-pointer hover:border-primary/50 transition-colors">
              <span className="text-stone-300 text-4xl mb-2 font-light">+</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                Add Book
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
