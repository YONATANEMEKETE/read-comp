'use client';

import { cn } from '@/lib/utils';

interface BookCardSkeletonProps {
  view?: 'grid' | 'list';
}

export function BookCardSkeleton({ view = 'grid' }: BookCardSkeletonProps) {
  if (view === 'list') {
    return (
      <div className="group grid grid-cols-[60px_1fr_40px] md:grid-cols-[60px_1fr_120px_130px_100px] gap-8 items-center px-8 py-4 rounded-2xl bg-transparent border border-dashed border-sepia-divider/60 dark:border-stone-800">
        {/* Cover Skeleton */}
        <div className="w-12 shrink-0">
          <div className="aspect-3/4 w-full rounded-md bg-stone-200 dark:bg-stone-800 animate-pulse" />
        </div>

        {/* Title & Author Skeleton */}
        <div className="min-w-0 flex flex-col justify-center gap-2">
          <div className="h-5 w-48 bg-stone-200 dark:bg-stone-800 rounded animate-pulse" />
          <div className="h-4 w-32 bg-stone-200 dark:bg-stone-800 rounded animate-pulse" />
        </div>

        {/* Date Skeleton (hidden on mobile) */}
        <div className="hidden md:block">
          <div className="h-4 w-24 bg-stone-200 dark:bg-stone-800 rounded animate-pulse" />
        </div>

        {/* Status Skeleton (hidden on mobile) */}
        <div className="hidden md:flex items-center">
          <div className="h-6 w-20 bg-stone-200 dark:bg-stone-800 rounded-full animate-pulse" />
        </div>

        {/* Actions Skeleton */}
        <div className="flex justify-end gap-3">
          <div className="size-9 rounded-full bg-stone-200 dark:bg-stone-800 animate-pulse" />
          <div className="size-9 rounded-full bg-stone-200 dark:bg-stone-800 animate-pulse" />
        </div>
      </div>
    );
  }

  // Grid View Skeleton
  return (
    <div className="book-card-skeleton flex flex-col">
      {/* Cover Skeleton */}
      <div className="relative aspect-3/4 w-full rounded-2xl overflow-hidden bg-stone-200 dark:bg-stone-800 mb-4 animate-pulse">
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      {/* Title Skeleton */}
      <div className="h-4 w-3/4 bg-stone-200 dark:bg-stone-800 rounded mb-2 animate-pulse" />

      {/* Author Skeleton */}
      <div className="h-3 w-1/2 bg-stone-200 dark:bg-stone-800 rounded animate-pulse" />
    </div>
  );
}

// Component to show multiple skeletons
interface BookCardSkeletonsProps {
  count?: number;
  view?: 'grid' | 'list';
}

export function BookCardSkeletons({
  count = 5,
  view = 'grid',
}: BookCardSkeletonsProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <BookCardSkeleton key={index} view={view} />
      ))}
    </>
  );
}
