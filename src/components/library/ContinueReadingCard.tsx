import { BookWithProgress } from '@/types/book';
import Image from 'next/image';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { ArrowRight } from 'lucide-react';

interface ContinueReadingCardProps {
  book: BookWithProgress;
}

export function ContinueReadingCard({ book }: ContinueReadingCardProps) {
  const currentPage = book.userProgress?.progressPage || 1;
  const totalPages = book.totalPages || 1;
  const progress = Math.min(100, Math.round((currentPage / totalPages) * 100));

  return (
    <Link href={`/read/${book.id}`} className="block group">
      <div className="w-full rounded-2xl border border-sepia-divider bg-white/70 dark:bg-stone-900/60 p-3 sm:p-4 shadow-soft transition-all hover:shadow-md">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative w-12 sm:w-14 shrink-0 aspect-[3/4] rounded-lg overflow-hidden border border-sepia-divider/60 shadow-sm">
            <Image
              src={book.thumbnailUrl}
              alt={book.title}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-[9px] uppercase tracking-[0.18em] text-stone-400 font-bold mb-0.5">
              Continue Reading
            </div>
            <h3 className="text-sm sm:text-base font-display font-semibold text-stone-900 dark:text-white truncate">
              {book.title}
            </h3>
            <p className="text-[11px] text-stone-500 italic truncate">{book.author}</p>

            <div className="mt-2 flex items-center gap-2">
              <Progress value={progress} className="h-1.5" />
              <span className="text-[9px] font-semibold text-stone-500">{progress}%</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center text-primary text-[11px] font-semibold">
            Open <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
