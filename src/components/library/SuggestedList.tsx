'use client';

import { BookCard } from './BookCard';
import { BookCardSkeletons } from './BookCardSkeleton';
import { FailedToLoadBook } from './FailedToLoadBook';
import { ArrowRight } from 'lucide-react';
import { useViewStore } from '@/store/useViewStore';
import { useFilterStore } from '@/store/useFilterStore';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { motion } from 'motion/react';
import { getSuggestedBooks } from '@/actions/books';
import { useQuery } from '@tanstack/react-query';
import { useSearchStore } from '@/store/useSearchStore';

export function SuggestedList() {
  const { view } = useViewStore();
  const { filters } = useFilterStore();
  const { searchTerm } = useSearchStore();

  const {
    data: books = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['suggested-books'],
    queryFn: async () => await getSuggestedBooks(),
  });

  console.log(books);

  if (isError)
    return (
      <FailedToLoadBook
        title="Something went wrong while loading suggestions"
        description="We couldn't load suggested books this time. Please check your connection and try again."
        onRetry={() => refetch()}
      />
    );

  // Check if ANY filter is active
  const hasActiveFilters =
    filters.reading || filters.onShelf || filters.finished;

  // Filter SUGGESTED BOOKS based on status and search term (client-side filtering)
  const filteredBooks = isLoading
    ? []
    : books
        .filter((b) => {
          // Apply search filter first - check if book title or author matches search term
          const matchesSearch =
            !searchTerm ||
            b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.author.toLowerCase().includes(searchTerm.toLowerCase());

          if (!matchesSearch) return false;

          // If NO filters are active, show books that match search
          if (!hasActiveFilters) return true;

          // Get the book's status (READING, FINISHED, or NEW/undefined for On Shelf)
          const status = b.userProgress?.status;

          // Check if this book matches any active filter (OR logic)
          if (status === 'READING' && filters.reading) return true;
          if (status === 'FINISHED' && filters.finished) return true;
          if ((status === 'NEW' || !status) && filters.onShelf) return true;

          // If no filter matches, don't show this book
          return false;
        })
        .slice(0, 12); // Limit to 12 books

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

      <motion.div
        key={`${view}-${isLoading ? 'loading' : filteredBooks.length}`}
        variants={container}
        initial="hidden"
        animate="visible"
        className={cn(
          view === 'grid'
            ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8'
            : 'flex flex-col gap-4',
        )}
      >
        {isLoading ? (
          <BookCardSkeletons count={5} view={view} />
        ) : (
          filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} view={view} />
          ))
        )}
      </motion.div>
    </section>
  );
}
