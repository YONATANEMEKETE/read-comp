'use client';

import { MOCK_BOOKS } from '@/lib/mock-data';
import { YourList } from '@/components/library/YourList';
import { SuggestedList } from '@/components/library/SuggestedList';
import { Suspense } from 'react';
import { useFilterStore } from '@/store/useFilterStore';

function LibraryContent() {
  // Get the current filter state from the store
  const { filters } = useFilterStore();

  // Check if ANY filter is active
  const hasActiveFilters =
    filters.reading || filters.onShelf || filters.finished;

  // Filter YOUR BOOKS based on status
  const yourBooks = MOCK_BOOKS.filter((b) => {
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

  // Filter SUGGESTED BOOKS
  const suggestedBooks = MOCK_BOOKS.filter((b) => {
    // Only include suggested books
    if (!b.isSuggested) return false;

    // If NO filters are active, show ALL suggested books
    if (!hasActiveFilters) return true;

    // Suggested books are considered "On Shelf" (new recommendations)
    // So they only show when the "On Shelf" filter is active
    return filters.onShelf;
  }).slice(0, 12); // Limit to 12 books

  return (
    <div className="flex-1 overflow-y-auto scroll-smooth">
      <div className="container max-w-7xl mx-auto py-8 px-6 md:px-10 space-y-12">
        <YourList books={yourBooks} />
        <SuggestedList books={suggestedBooks} />
      </div>
    </div>
  );
}

export default function LibraryPage() {
  return (
    <Suspense
      fallback={<div className="p-10 text-stone-400">Loading library...</div>}
    >
      <LibraryContent />
    </Suspense>
  );
}
