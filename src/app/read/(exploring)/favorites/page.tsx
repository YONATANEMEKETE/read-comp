'use client';

import { BookCard } from '@/components/library/BookCard';
import { BookCardSkeletons } from '@/components/library/BookCardSkeleton';
import { EmptyList } from '@/components/library/EmptyList';
import { FailedToLoadBook } from '@/components/library/FailedToLoadBook';
import { cn } from '@/lib/utils';
import { useViewStore } from '@/store/useViewStore';
import { useFilterStore } from '@/store/useFilterStore';
import { motion } from 'motion/react';
import {
  getFavoriteBooks,
  updateBookFavoriteAction,
  updateBookDeleteAction,
} from '@/actions/books';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchStore } from '@/store/useSearchStore';
import { useState } from 'react';
import { toast } from 'sonner';

export default function FavoritesPage() {
  const queryClient = useQueryClient();
  const { view } = useViewStore();
  const { filters } = useFilterStore();
  const { searchTerm } = useSearchStore();

  const {
    data: books = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['favorite-books'],
    queryFn: async () => await getFavoriteBooks(),
  });

  const handleToggleFavorite = async (bookId: string, isFavorite: boolean) => {
    // Get the current cached data to restore in case of error
    const previousBooks = queryClient.getQueryData(['favorite-books']);

    try {
      // Optimistically update the cache
      queryClient.setQueryData(['favorite-books'], (old: any) => {
        if (!old) return old;

        // Handle different possible structures of cached data
        if (Array.isArray(old)) {
          // If it's a simple array of books
          return old.map((b) =>
            b.id === bookId
              ? {
                  ...b,
                  userProgress: {
                    ...b.userProgress,
                    isFavorite: isFavorite,
                  },
                }
              : b,
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
                            isFavorite: isFavorite,
                          },
                        }
                      : b,
                  )
                : page.books,
            })),
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
                          isFavorite: isFavorite,
                        },
                      }
                    : b,
                )
              : old.books,
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
      queryClient.setQueryData(['favorite-books'], previousBooks);
      toast.error('Failed to update favorite status. Please try again.');
    }
  };

  const handleDelete = async (bookId: string) => {
    // Get the current cached data to restore in case of error
    const previousBooks = queryClient.getQueryData(['favorite-books']);

    try {
      // Optimistically update the cache to remove the book
      queryClient.setQueryData(['favorite-books'], (old: any) => {
        if (!old) return old;

        // Handle different possible structures of cached data
        if (Array.isArray(old)) {
          // If it's a simple array of books
          return old.filter((b) => b.id !== bookId);
        } else if (old.pages) {
          // If it's a paginated response
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              books: Array.isArray(page.books)
                ? page.books.filter((b: any) => b.id !== bookId)
                : page.books,
            })),
          };
        } else if (old.books) {
          // If it's an object with a books property
          return {
            ...old,
            books: Array.isArray(old.books)
              ? old.books.filter((b: any) => b.id !== bookId)
              : old.books,
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
      queryClient.setQueryData(['favorite-books'], previousBooks);
      toast.error('Failed to delete book. Please try again.');
    }
  };

  if (isError)
    return (
      <FailedToLoadBook
        title="Something went wrong while loading your favorites"
        description="We couldn't load your favorite books this time. Please check your connection and try again."
        onRetry={() => refetch()}
      />
    );

  // Check if ANY filter is active
  const hasActiveFilters =
    filters.reading || filters.onShelf || filters.finished;

  // Filter FAVORITE BOOKS based on status and search term (client-side filtering)
  const filteredBooks = isLoading
    ? []
    : books.filter((b) => {
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
      });

  if (filteredBooks.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] w-full px-2">
        <EmptyList
          title="No favorite books yet"
          description="Mark books as favorites to see them here."
          showButton={false}
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
          <h1 className="text-2xl font-bold text-stone-900 dark:text-white mb-2">
            Favorite Books
          </h1>
          <p className="text-stone-600 dark:text-stone-400">
            {filteredBooks.length} favorite book
            {filteredBooks.length !== 1 ? 's' : ''}
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
                <BookCard
                  key={book.id}
                  book={book}
                  view={view}
                  onToggleFavorite={handleToggleFavorite}
                  onDelete={handleDelete}
                />
              ))}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
