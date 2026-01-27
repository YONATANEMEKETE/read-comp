'use client';

import { Heart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface DetailHeaderProps {
  title: string;
  author: string;
  currentPage: number;
  totalPages: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function DetailHeader({
  title,
  author,
  currentPage,
  totalPages,
  isFavorite,
  onToggleFavorite,
}: DetailHeaderProps) {
  const progressPercentage =
    totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;

  return (
    <header className="h-16 border-b border-sepia-divider dark:border-stone-800 flex items-center justify-between px-6 bg-white/60 dark:bg-sidebar-dark/80 backdrop-blur-sm z-30 shrink-0">
      <div className="flex items-center gap-4 w-1/3">
        <Link
          href="/read"
          className="flex items-center gap-2 text-stone-500 hover:text-stone-800 transition-colors group"
        >
          <ArrowLeft
            size={20}
            className="transition-transform group-hover:-translate-x-1"
          />
          <span className="text-sm font-medium">Back to Library</span>
        </Link>
      </div>

      <div className="flex flex-col items-center w-1/3">
        <h1 className="font-display font-semibold text-stone-900 dark:text-white text-lg tracking-tight truncate max-w-full">
          {title}
        </h1>
        <div className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mt-0.5">
          {author}
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 w-1/3">
        <div className="flex items-center gap-3 bg-stone-100 dark:bg-stone-800 px-3 py-1.5 rounded-full">
          <span className="text-xs font-medium text-stone-600 dark:text-stone-300 w-12 text-right">
            {progressPercentage}%
          </span>
          <div className="w-24 h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary w-0 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleFavorite}
          className="p-2 text-stone-400 hover:text-stone-800 transition-colors"
        >
          <Heart
            size={20}
            className={isFavorite ? 'fill-current text-[#cda2a2]' : ''}
          />
        </Button>
      </div>
    </header>
  );
}
