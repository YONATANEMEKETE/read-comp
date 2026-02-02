'use client';

import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FailedToLoadBookProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function FailedToLoadBook({
  title = 'Something went wrong while loading your library',
  description = "We couldn't load your collection this time. Please check your connection and try again.",
  onRetry,
  className = '',
}: FailedToLoadBookProps) {
  return (
    <div
      className={cn(
        "flex-1 flex flex-col items-center justify-center text-center p-6 sm:p-12 md:p-16 rounded-[2rem] sm:rounded-3xl border-2 border-dashed border-sepia-divider bg-white/50 dark:bg-stone-800/30",
        className
      )}
    >
      <div className="size-16 sm:size-24 rounded-full bg-dusty-rose/10 flex items-center justify-center mb-6">
        <div className="text-[32px] sm:text-[48px] text-dusty-rose transform rotate-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-8 h-8 sm:w-12 sm:h-12"
          >
            <path
              fillRule="evenodd"
              d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      <h3 className="font-display text-lg sm:text-xl font-semibold text-stone-900 dark:text-white mb-2 sm:mb-3 px-4">
        {title}
      </h3>
      <p className="text-stone-500 dark:text-stone-400 max-w-sm mb-6 sm:mb-8 text-xs sm:text-sm leading-relaxed px-4">
        {description}
      </p>
      {onRetry && (
        <Button
          onClick={onRetry}
          className="flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm font-semibold rounded-full shadow-soft transition-all active:scale-[0.98] focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 cursor-pointer"
        >
          <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5" />
          Retry
        </Button>
      )}
    </div>
  );
}
