'use client';

import { BookCard } from './BookCard';
import { BookCardSkeletons } from './BookCardSkeleton';
import { EmptyList } from './EmptyList';
import { FailedToLoadBook } from './FailedToLoadBook';
import { UploadBookDialog } from '../dashboard/UploadBookDialog';
import { cn } from '@/lib/utils';
import { useViewStore } from '@/store/useViewStore';
import { useFilterStore } from '@/store/useFilterStore';
import Link from 'next/link';
import { ArrowRight, Upload } from 'lucide-react';
import { motion } from 'motion/react';
import { getUserBooks } from '@/actions/books';
import { useQuery } from '@tanstack/react-query';
import { useSearchStore } from '@/store/useSearchStore';
import { useState } from 'react';

export function YourList() {
  const { view } = useViewStore();
  const { filters } = useFilterStore();
  const { searchTerm } = useSearchStore();

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const {
    data: books = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['user-books'],
    queryFn: async () => await getUserBooks(),
  });

  console.log(books);

  if (isError)
    return (
      <FailedToLoadBook
        title="Something went wrong while loading your library"
        description="We couldn't load your collection this time. Please check your connection and try again."
        onRetry={() => refetch()}
      />
    );

  // Check if ANY filter is active
  const hasActiveFilters =
    filters.reading || filters.onShelf || filters.finished;

  // Filter YOUR BOOKS based on status and search term (client-side filtering)
  const filteredBooks = isLoading
    ? []
    : books
        .filter((b) => {
          // Apply search filter first - check if book title or author matches search term
          const matchesSearch = !searchTerm ||
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
        .slice(0, 5); // Limit to 5 books

  if (filteredBooks.length === 0 && !isLoading) {
    return (
      <>
        <EmptyList
          title="Your library is empty"
          description="Upload your first PDF to start your reading journey and build your personal collection."
          showButton={true}
          buttonText="Upload PDF"
          buttonIcon={<Upload className="h-4 w-4" />}
          onButtonClick={() => setIsUploadDialogOpen(true)}
        />
        <UploadBookDialog
          open={isUploadDialogOpen}
          onOpenChange={setIsUploadDialogOpen}
        />
      </>
    );
  }

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
    <>
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
            <>
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} view={view} />
              ))}

              {view === 'grid' && filteredBooks.length > 0 && (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, scale: 0.9 },
                    visible: { opacity: 1, scale: 1 },
                  }}
                  className="flex flex-col opacity-60"
                  onClick={() => setIsUploadDialogOpen(true)}
                >
                  <div className="aspect-3/4 w-full rounded-2xl border-2 border-dashed border-sepia-divider mb-4 flex flex-col items-center justify-center group cursor-pointer hover:border-primary/50 transition-colors">
                    <span className="text-stone-300 text-4xl mb-2 font-light">
                      +
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                      Add Book
                    </span>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </section>
      <UploadBookDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
      />
    </>
  );
}
