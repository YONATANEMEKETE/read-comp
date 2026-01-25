'use client';

import { BookWithProgress } from '@/types/book';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  MoreVertical,
  Play,
  CheckCircle2,
  Clock,
  Heart,
  BookOpen,
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BookStatusBadge } from './BookStatusBadge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';

interface BookCardProps {
  book: BookWithProgress;
  view?: 'grid' | 'list';
}

export function BookCard({ book, view = 'grid' }: BookCardProps) {
  const isReading = book.userProgress?.status === 'READING';
  const isFinished = book.userProgress?.status === 'FINISHED';
  const isFavorite = book.userProgress?.isFavorite;

  // Format date for list view (using simplistic formatting for now)
  const dateAdded = new Date(book.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  if (view === 'list') {
    return (
      <TooltipProvider>
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 5 },
            visible: { opacity: 1, y: 0 },
          }}
          className="group grid grid-cols-[60px_1fr_40px] md:grid-cols-[60px_1fr_120px_130px_100px] gap-8 items-center px-8 py-4 rounded-2xl cursor-pointer bg-transparent border border-dashed border-sepia-divider/60 dark:border-stone-800 transition-all duration-300 hover:bg-white hover:dark:bg-stone-800"
        >
          {/* Cover */}
          <div className="w-12 shrink-0">
            <Link href={`/read/${book.id}`}>
              <div className="aspect-[3/4] w-full rounded-md shadow-sm bg-cover bg-center border border-[#e5ddd3]/30 overflow-hidden relative">
                <Image
                  src={book.thumbnailUrl}
                  alt={book.title}
                  fill
                  className="object-cover"
                />
              </div>
            </Link>
          </div>

          {/* Title & Author */}
          <div className="min-w-0 flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <Link href={`/read/${book.id}`}>
                <h4 className="font-display text-lg font-semibold text-stone-900 dark:text-white truncate hover:underline">
                  {book.title}
                </h4>
              </Link>
              {isFavorite && (
                <Heart className="h-4 w-4 text-[#cda2a2] fill-current" />
              )}
            </div>
            <Link href={`/read/${book.id}`}>
              <p className="text-sm text-stone-500 italic hover:underline">{book.author}</p>
            </Link>
          </div>

          {/* Date Added */}
          <div className="hidden md:block text-sm text-stone-400 font-sans">
            {dateAdded}
          </div>

          {/* Status */}
          <div className="hidden md:flex items-center">
            <BookStatusBadge status={book.userProgress?.status || 'NEW'} view={view} />
          </div>

          {/* Options */}
          <div className="flex justify-end gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/read/${book.id}`}>
                  <button
                    className={cn(
                      'size-9 flex items-center justify-center rounded-full transition-all',
                      isReading
                        ? 'bg-[#9a8470] text-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:scale-105'
                        : 'bg-stone-100 dark:bg-stone-700 text-stone-400 hover:bg-[#9a8470] hover:text-white shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.03)]',
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Play className="h-5 w-5 fill-current" />
                  </button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                {book.userProgress?.status === 'READING' && 'Continue Reading'}
                {book.userProgress?.status === 'FINISHED' && 'Revisit Book'}
                {(!book.userProgress?.status || book.userProgress?.status === 'NEW') && 'Start Reading'}
              </TooltipContent>
            </Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="size-9 flex items-center justify-center rounded-full text-stone-400 hover:text-stone-600 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <MoreVertical className="h-[22px] w-[22px]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>View Details</DropdownMenuItem>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Mark as Finished</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                  Remove from Library
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Link href={`/read/${book.id}`}>
        <motion.div
          variants={{
            hidden: { opacity: 0, scale: 0.9 },
            visible: { opacity: 1, scale: 1 },
          }}
          className="book-card group cursor-pointer flex flex-col"
        >
          <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] mb-4 transition-transform duration-300 hover:-translate-y-1">
            <Image
              src={book.thumbnailUrl}
              alt={book.title}
              fill
              className="object-cover"
            />

            {/* Hover Overlay */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="play-overlay absolute inset-0 bg-black/30 opacity-0 transition-opacity flex items-center justify-center backdrop-blur-[2px] group-hover:opacity-100">
                  <div className="size-12 rounded-full bg-white/90 text-[#9a8470] flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                    <Play className="h-8 w-8 fill-current translate-x-0.5" />
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {book.userProgress?.status === 'READING' && 'Continue Reading'}
                {book.userProgress?.status === 'FINISHED' && 'Revisit Book'}
                {(!book.userProgress?.status || book.userProgress?.status === 'NEW') && 'Start Reading'}
              </TooltipContent>
            </Tooltip>

            {/* Status Badges (Top Left) */}
            <BookStatusBadge
              status={book.userProgress?.status || 'NEW'}
              view={view}
              className="absolute top-3 left-3 px-2 py-0.5"
            />

            {/* Favorite Icon (Top Right) */}
            {isFavorite && (
              <div className="absolute top-3 right-3 text-[#cda2a2]">
                <Heart className="h-5 w-5 fill-current" />
              </div>
            )}
          </div>

          <h4 className="font-display text-base font-semibold text-stone-900 dark:text-white leading-tight mb-1 line-clamp-1">
            {book.title}
          </h4>
          <p className="text-xs text-stone-500 italic line-clamp-1">
            {book.author}
          </p>
        </motion.div>
      </Link>
    </TooltipProvider>
  );
}
