'use client';

import { MoreHorizontal, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DetailHeaderProps {
  title?: string;
  author?: string;
  currentPage?: number;
  totalPages?: number;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  isLoading?: boolean;
  isSaving?: boolean;
  onMarkAsFinished?: () => void;
  onRestartBook?: () => void;
  status?: 'NEW' | 'READING' | 'FINISHED';
}

export function DetailHeader({
  title,
  author,
  currentPage = 0,
  totalPages = 0,
  isLoading = false,
  isSaving = false,
  onMarkAsFinished,
  onRestartBook,
  status,
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
        {isLoading ? (
          <>
            <div className="h-5 w-32 bg-stone-200 dark:bg-stone-800 animate-pulse rounded-md" />
            <div className="h-3 w-20 bg-stone-100 dark:bg-stone-800/60 animate-pulse rounded-md mt-1.5" />
          </>
        ) : (
          <>
            <h1 className="font-display font-semibold text-stone-900 dark:text-white text-lg tracking-tight truncate max-w-full">
              {title}
            </h1>
            <div className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mt-0.5">
              {author}
            </div>
          </>
        )}
      </div>

      <div className="flex items-center justify-end gap-4 w-1/3">
        {isLoading ? (
          <div className="flex items-center gap-3 bg-stone-50 dark:bg-stone-800/50 px-3 py-1.5 rounded-full">
            <div className="h-3 w-8 bg-stone-200 dark:bg-stone-700 animate-pulse rounded" />
            <div className="w-24 h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden" />
          </div>
        ) : (
          <div className="flex items-center gap-3 bg-stone-100 dark:bg-stone-800 px-3 py-1.5 rounded-full">
            <span className="text-xs font-medium text-stone-600 dark:text-stone-300 text-right px-1">
              {progressPercentage}%
            </span>
            {isSaving && (
              <span className="text-[10px] text-amber-600 animate-pulse">
                Syncing...
              </span>
            )}
            <div className="w-24 h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="p-2 text-stone-400 hover:text-stone-800 transition-colors cursor-pointer"
            >
              <MoreHorizontal size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-52">
            <DropdownMenuItem 
              className="cursor-pointer" 
              onClick={onMarkAsFinished}
              disabled={status === 'FINISHED'}
            >
              {status === 'FINISHED' ? 'Already Finished' : 'Mark as Finished'}
            </DropdownMenuItem>
            {status === 'FINISHED' && (
              <DropdownMenuItem 
                className="cursor-pointer text-amber-600" 
                onClick={onRestartBook}
              >
                Restart Book
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
