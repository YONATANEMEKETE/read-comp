import { ReadingStatus } from '@/types/book';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface BookStatusBadgeProps {
  status: ReadingStatus;
  className?: string;
}

export function BookStatusBadge({ status, className }: BookStatusBadgeProps) {
  if (status === 'READING') {
    return (
      <span
        className={cn(
          'inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-muted-blue text-white',
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
          'inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sage-green text-white',
          className,
        )}
      >
        Finished
      </span>
    );
  }

  // Covers 'NEW' or any other fallback
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-400 text-white',
        className,
      )}
    >
      On Shelf
    </span>
  );
}
