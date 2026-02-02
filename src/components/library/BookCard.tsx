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
import { BookStatusBadge } from './BookStatusBadge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import { BookDropdownMenu } from '@/components/ui/BookDropdownMenu';
import { useRouter } from 'next/navigation';

interface BookCardProps {
  book: BookWithProgress;
  view?: 'grid' | 'list';
  onToggleFavorite?: (bookId: string, isFavorite: boolean) => void;
  onDelete?: (bookId: string) => void;
}

export function BookCard({ book, view = 'grid', onToggleFavorite, onDelete }: BookCardProps) {
  const router = useRouter();
  const isReading = book.userProgress?.status === 'READING';
  const isFinished = book.userProgress?.status === 'FINISHED';
  const isFavorite = book.userProgress?.isFavorite;

  // Format date for list view (using simplistic formatting for now)
  const dateAdded = new Date(book.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const handleReadNow = () => {
    // Navigate to the book reading page using Next.js router
    router.push(`/read/${book.id}`);
  };

  if (view === 'list') {
    return (
      <TooltipProvider>
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 5 },
            visible: { opacity: 1, y: 0 },
          }}
          className="group grid grid-cols-[42px_1fr_70px] sm:grid-cols-[60px_1fr_80px] md:grid-cols-[60px_1fr_100px_90px] lg:grid-cols-[60px_1fr_120px_130px_100px] gap-3 sm:gap-4 lg:gap-8 items-center px-3 sm:px-6 md:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl cursor-pointer bg-transparent border border-dashed border-sepia-divider/60 dark:border-stone-800 transition-all duration-300 hover:bg-white hover:dark:bg-stone-800"
        >
          {/* Cover */}
          <div className="w-10 sm:w-12 shrink-0">
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
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link href={`/read/${book.id}`} className="min-w-0">
                <h4 className="font-display text-sm sm:text-lg font-semibold text-stone-900 dark:text-white truncate hover:underline">
                  {book.title}
                </h4>
              </Link>
              {isFavorite && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="shrink-0">
                      <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-[#cda2a2] fill-current" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Your favorite book</TooltipContent>
                </Tooltip>
              )}
            </div>
            <Link href={`/read/${book.id}`} className="min-w-0">
              <p className="text-[10px] sm:text-sm text-stone-500 italic hover:underline truncate">{book.author}</p>
            </Link>
          </div>

          {/* Date Added - Only on Large */}
          <div className="hidden lg:block text-sm text-stone-400 font-sans truncate">
            {dateAdded}
          </div>

          {/* Status - Shown from MD */}
          <div className="hidden md:flex items-center">
            <BookStatusBadge status={book.userProgress?.status || 'NEW'} view={view} />
          </div>

          {/* Options */}
          <div className="flex justify-end gap-1 sm:gap-3 shrink-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/read/${book.id}`}>
                  <button
                    className={cn(
                      'size-7 sm:size-9 flex items-center justify-center rounded-full transition-all',
                      isReading
                        ? 'bg-[#9a8470] text-white shadow-soft hover:scale-105'
                        : 'bg-stone-100 dark:bg-stone-700 text-stone-400 hover:bg-[#9a8470] hover:text-white shadow-inner-soft',
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Play className="h-3.5 w-3.5 sm:h-5 sm:w-5 fill-current" />
                  </button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                {book.userProgress?.status === 'READING' && 'Continue Reading'}
                {book.userProgress?.status === 'FINISHED' && 'Revisit Book'}
                {(!book.userProgress?.status || book.userProgress?.status === 'NEW') && 'Start Reading'}
              </TooltipContent>
            </Tooltip>
            <BookDropdownMenu
              bookType={book.isSuggested ? 'suggested' : 'your-library'}
              isFavorite={isFavorite}
              onReadNow={handleReadNow}
              onMarkFavorite={() => onToggleFavorite?.(book.id, !isFavorite)}
              onDelete={() => onDelete?.(book.id)}
            />
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
          className="book-card group cursor-pointer flex flex-col w-full"
        >
          <div className="relative aspect-[3/4] w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] mb-3 sm:mb-4 transition-transform duration-300 hover:-translate-y-1">
            <Image
              src={book.thumbnailUrl}
              alt={book.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
            />

            {/* Hover Overlay */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="play-overlay absolute inset-0 bg-black/30 opacity-0 transition-opacity flex items-center justify-center backdrop-blur-[2px] group-hover:opacity-100">
                  <div className="size-10 sm:size-12 rounded-full bg-white/90 text-[#9a8470] flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                    <Play className="h-6 w-6 sm:h-8 sm:w-8 fill-current translate-x-0.5" />
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
              className="absolute top-2 left-2 sm:top-3 sm:left-3 px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[10px]"
            />

            {/* Favorite Icon (Top Right) */}
            {isFavorite && (
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 text-[#cda2a2]">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
              </div>
            )}
          </div>

          <h4 className="font-display text-sm sm:text-base font-semibold text-stone-900 dark:text-white leading-tight mb-0.5 sm:mb-1 line-clamp-1">
            {book.title}
          </h4>
          <p className="text-[10px] sm:text-xs text-stone-500 italic line-clamp-1">
            {book.author}
          </p>
        </motion.div>
      </Link>
    </TooltipProvider>
  );
}
