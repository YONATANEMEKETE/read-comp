'use client';

import { BookCard } from '@/components/library/BookCard';
import { BookCardSkeletons } from '@/components/library/BookCardSkeleton';
import { EmptyList } from '@/components/library/EmptyList';
import { FailedToLoadBook } from '@/components/library/FailedToLoadBook';
import { UploadBookDialog } from '@/components/dashboard/UploadBookDialog';
import { cn } from '@/lib/utils';
import { useViewStore } from '@/store/useViewStore';
import { useFilterStore } from '@/store/useFilterStore';
import { motion } from 'motion/react';
import { getUserBooks, updateBookFavoriteAction, updateBookDeleteAction } from '@/actions/books';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchStore } from '@/store/useSearchStore';
import { useState } from 'react';
import { toast } from 'sonner';

export default function YourLibraryPage() {
  const queryClient = useQueryClient();
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

  const handleToggleFavorite = async (bookId: string, isFavorite: boolean) => {
    // Get the current cached data to restore in case of error
    const previousBooks = queryClient.getQueryData(['user-books']);

    try {
      // Optimistically update the cache
      queryClient.setQueryData(['user-books'], (old: any) => {
        if (!old) return old;

        // Handle different possible structures of cached data
        if (Array.isArray(old)) {
          // If it's a simple array of books
          return old.map(b =>
            b.id === bookId
              ? {
                  ...b,
                  userProgress: {
                    ...b.userProgress,
                    isFavorite: isFavorite
                  }
                }
              : b
          );
        } else if (old.pages) {
          // If it's a paginated response
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              books: Array.isArray(page.books)
                ? page.books.map((b: any) =>
                    b.id === bookId
                      ? {
                          ...b,
                          userProgress: {
                            ...b.userProgress,
                            isFavorite: isFavorite
                          }
                        }
                      : b
                  )
                : page.books
            }))
          };
        } else if (old.books) {
          // If it's an object with a books property
          return {
            ...old,
            books: Array.isArray(old.books)
              ? old.books.map((b: any) =>
                  b.id === bookId
                    ? {
                        ...b,
                        userProgress: {
                          ...b.userProgress,
                          isFavorite: isFavorite
                        }
                      }
                    : b
                )
              : old.books
          };
        }

        return old;
      });

      // Call the server action
      const result = await updateBookFavoriteAction(bookId, isFavorite);

      if (!result.success) {
        // Error: throw to trigger catch block
        throw new Error(result.message);
      }
    } catch (error) {
      // Revert the optimistic update on error
      queryClient.setQueryData(['user-books'], previousBooks);
      toast.error('Failed to update favorite status. Please try again.');
    }
  };

  const handleDelete = async (bookId: string) => {
    // Get the current cached data to restore in case of error
    const previousBooks = queryClient.getQueryData(['user-books']);

    try {
      // Optimistically update the cache to remove the book
      queryClient.setQueryData(['user-books'], (old: any) => {
        if (!old) return old;

        // Handle different possible structures of cached data
        if (Array.isArray(old)) {
          // If it's a simple array of books
          return old.filter(b => b.id !== bookId);
        } else if (old.pages) {
          // If it's a paginated response
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              books: Array.isArray(page.books)
                ? page.books.filter((b: any) => b.id !== bookId)
                : page.books
            }))
          };
        } else if (old.books) {
          // If it's an object with a books property
          return {
            ...old,
            books: Array.isArray(old.books)
              ? old.books.filter((b: any) => b.id !== bookId)
              : old.books
          };
        }

        return old;
      });

      // Call the server action
      const result = await updateBookDeleteAction(bookId);

      if (!result.success) {
        // Error: throw to trigger catch block
        throw new Error(result.message);
      }
    } catch (error) {
      // Revert the optimistic update on error
      queryClient.setQueryData(['user-books'], previousBooks);
      toast.error('Failed to delete book. Please try again.');
    }
  };

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
        });

  if (filteredBooks.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <EmptyList
          title="Your library is empty"
          description="Upload your first PDF to start your reading journey and build your personal collection."
          showButton={true}
          buttonText="Upload PDF"
          onButtonClick={() => setIsUploadDialogOpen(true)}
        />
        <UploadBookDialog
          open={isUploadDialogOpen}
          onOpenChange={setIsUploadDialogOpen}
        />
      </div>
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
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-stone-900 dark:text-white mb-2">Your Library</h1>
          <p className="text-stone-600 dark:text-stone-400">
            {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} in your collection
          </p>
        </div>

        <motion.div
          key={`${view}-${searchTerm}-${filters.reading}-${filters.onShelf}-${filters.finished}-${isLoading ? 'loading' : filteredBooks.length}`}
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
            <BookCardSkeletons count={10} view={view} />
          ) : (
            <>
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} view={view} onToggleFavorite={handleToggleFavorite} onDelete={handleDelete} />
              ))}
              
              {/* Add upload button at the end if in grid view */}
              {view === 'grid' && (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, scale: 0.9 },
                    visible: { opacity: 1, scale: 1 },
                  }}
                  className="flex flex-col opacity-60"
                  onClick={() => setIsUploadDialogOpen(true)}
                >
                  <div className="aspect-[3/4] w-full rounded-2xl border-2 border-dashed border-sepia-divider mb-4 flex flex-col items-center justify-center group cursor-pointer hover:border-primary/50 transition-colors">
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
      </div>
      <UploadBookDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
      />
    </div>
  );
}