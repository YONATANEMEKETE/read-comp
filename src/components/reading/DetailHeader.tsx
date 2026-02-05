'use client';

import { MoreHorizontal, ArrowLeft, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useOffline } from '@/hooks/use-offline';

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
  isOffline?: boolean;
  onToggleFocusMode?: () => void;
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
  isOffline: isOfflineProp = false,
  onToggleFocusMode,
}: DetailHeaderProps) {
  const hookOffline = useOffline();
  const isOffline = isOfflineProp || hookOffline;
  const progressPercentage =
    totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;

  return (
    <header className="h-16 border-b border-sepia-divider dark:border-stone-800 flex items-center justify-between px-4 sm:px-6 bg-white/60 dark:bg-sidebar-dark/80 backdrop-blur-sm z-30 shrink-0">
      <div className="flex items-center gap-2 sm:gap-4 w-1/4 sm:w-1/3">
        <Link
          href="/read"
          className="flex items-center gap-2 text-stone-500 hover:text-stone-800 transition-colors group"
        >
          <ArrowLeft
            size={20}
            className="transition-transform group-hover:-translate-x-1 shrink-0"
          />
          <span className="text-sm font-medium hidden sm:inline truncate">Back to Library</span>
        </Link>
        {isOffline && (
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-200">
            Offline
          </span>
        )}
      </div>

      <div className="flex flex-col items-center flex-1 min-w-0 px-2 sm:w-1/3 text-center">
        {isLoading ? (
          <>
            <div className="h-5 w-24 sm:w-32 bg-stone-200 dark:bg-stone-800 animate-pulse rounded-md" />
            <div className="h-3 w-16 sm:w-20 bg-stone-100 dark:bg-stone-800/60 animate-pulse rounded-md mt-1.5" />
          </>
        ) : (
          <>
            <h1 className="font-display font-semibold text-stone-900 dark:text-white text-sm sm:text-base md:text-lg tracking-tight truncate max-w-full">
              {title}
            </h1>
            <div className="text-[8px] sm:text-[10px] uppercase tracking-widest text-stone-400 font-bold mt-0.5 truncate max-w-full">
              {author}
            </div>
          </>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 sm:gap-4 w-1/4 sm:w-1/3">
        {isLoading ? (
          <div className="flex items-center gap-3 bg-stone-50 dark:bg-stone-800/50 px-2 sm:px-3 py-1.5 rounded-full">
            <div className="h-3 w-6 sm:w-8 bg-stone-200 dark:bg-stone-700 animate-pulse rounded" />
            <div className="hidden sm:block w-16 sm:w-24 h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden" />
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3 bg-stone-100 dark:bg-stone-800 px-2 sm:px-3 py-1.5 rounded-full">
            <span className="text-[10px] sm:text-xs font-medium text-stone-600 dark:text-stone-300 text-right">
              {progressPercentage}%
            </span>
            {isSaving && (
              <span className="hidden sm:inline text-[9px] sm:text-[10px] text-amber-600 animate-pulse">
                Syncing...
              </span>
            )}
            <div className="hidden sm:block w-16 sm:w-24 h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleFocusMode}
          className="size-8 sm:size-10 p-0 text-stone-400 hover:text-stone-800 transition-colors cursor-pointer shrink-0"
          title="Focus mode"
        >
          <Maximize2 size={18} />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 sm:size-10 p-0 text-stone-400 hover:text-stone-800 transition-colors cursor-pointer shrink-0"
            >
              <MoreHorizontal size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-52">
            <DropdownMenuItem 
              className="cursor-pointer" 
              onClick={onMarkAsFinished}
              disabled={status === 'FINISHED' || isOffline}
            >
              {status === 'FINISHED' ? 'Already Finished' : 'Mark as Finished'}
            </DropdownMenuItem>
            {status === 'FINISHED' && (
              <DropdownMenuItem 
                className="cursor-pointer text-amber-600" 
                onClick={onRestartBook}
                disabled={isOffline}
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
