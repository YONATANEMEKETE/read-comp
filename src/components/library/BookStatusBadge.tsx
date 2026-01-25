import { ReadingStatus } from '@/types/book';
import { cn } from '@/lib/utils';

interface BookStatusBadgeProps {
  status: ReadingStatus;
  className?: string;
  view?: 'grid' | 'list';
}

export function BookStatusBadge({ status, className, view = 'grid' }: BookStatusBadgeProps) {
  // For list view, use outline style
  if (view === 'list') {
    if (status === 'READING') {
      return (
        <span
          className={cn(
            'inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-indigo-600 text-indigo-600 bg-transparent',
            className,
          )}
        >
          Reading
        </span>
      );
    }

    if (status === 'FINISHED') {
      return (
        <span
          className={cn(
            'inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-600 text-emerald-600 bg-transparent',
            className,
          )}
        >
          Finished
        </span>
      );
    }

    // covers 'NEW' or any other fallback
    return (
      <span
        className={cn(
          'inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-amber-500 text-amber-500 bg-transparent',
          className,
        )}
      >
        On Shelf
      </span>
    );
  }

  // For grid view, use solid background style
  if (status === 'READING') {
    return (
      <span
        className={cn(
          'inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-600 text-white',
          className,
        )}
      >
        Reading
      </span>
    );
  }

  if (status === 'FINISHED') {
    return (
      <span
        className={cn(
          'inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white',
          className,
        )}
      >
        Finished
      </span>
    );
  }

  // covers 'NEW' or any other fallback
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-white',
        className,
      )}
    >
      On Shelf
    </span>
  );
}
