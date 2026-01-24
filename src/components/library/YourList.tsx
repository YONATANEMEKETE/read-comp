'use client';

import { BookCard } from './BookCard';
import { cn } from '@/lib/utils';
import { useViewStore } from '@/store/useViewStore';
import { useFilterStore } from '@/store/useFilterStore';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { MOCK_BOOKS } from '@/lib/mock-data';

export function YourList() {
  const { view } = useViewStore();
  const { filters } = useFilterStore();

  // Check if ANY filter is active
  const hasActiveFilters =
    filters.reading || filters.onShelf || filters.finished;

  // Filter YOUR BOOKS based on status
  const books = MOCK_BOOKS.filter((b) => {
    // Skip suggested books (they go in the suggested list)
    if (b.isSuggested) return false;

    // If NO filters are active, show ALL books
    if (!hasActiveFilters) return true;

    // Get the book's status (READING, FINISHED, or NEW/undefined for On Shelf)
    const status = b.userProgress?.status;

    // Check if this book matches any active filter (OR logic)
    if (status === 'READING' && filters.reading) return true;
    if (status === 'FINISHED' && filters.finished) return true;
    if ((status === 'NEW' || !status) && filters.onShelf) return true;

    // If no filter matches, don't show this book
    return false;
  }).slice(0, 5); // Limit to 5 books

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <section className="mb-14">
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col gap-1">
          <h3 className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-[0.2em] font-sans">
            Your Library
          </h3>
        </div>

        <Link
          href="/read/yourlibraries"
          className="group flex items-center gap-2 text-[10px] font-bold text-primary hover:text-stone-900 dark:hover:text-stone-200 transition-colors uppercase tracking-widest"
        >
          View All
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <motion.div
        key={`${view}-${books.length}`}
        variants={container}
        initial="hidden"
        animate="visible"
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
          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              visible: { opacity: 1, scale: 1 },
            }}
            className="flex flex-col opacity-60"
          >
            <div className="aspect-3/4 w-full rounded-2xl border-2 border-dashed border-sepia-divider mb-4 flex flex-col items-center justify-center group cursor-pointer hover:border-primary/50 transition-colors">
              <span className="text-stone-300 text-4xl mb-2 font-light">+</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                Add Book
              </span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
