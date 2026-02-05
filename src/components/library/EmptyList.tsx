import { Button } from '@/components/ui/button';
import { BookOpen, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyListProps {
  title: string;
  description: string;
  showButton?: boolean;
  buttonText?: string;
  buttonIcon?: React.ReactNode;
  onButtonClick?: () => void;
  buttonDisabled?: boolean;
  className?: string;
}

export function EmptyList({
  title,
  description,
  showButton = false,
  buttonText,
  buttonIcon,
  onButtonClick,
  buttonDisabled = false,
  className,
}: EmptyListProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center w-full min-h-[50vh] md:min-h-[70vh] py-12 md:py-16 bg-white/40 dark:bg-stone-800/20 rounded-[2rem] md:rounded-3xl border border-dashed border-sepia-divider px-6',
        className,
      )}
    >
      <div className="bg-primary/5 dark:bg-primary/10 p-6 md:p-8 rounded-full mb-6 relative">
        <div className="w-12 h-12 md:w-16 md:h-16 text-primary/40 flex items-center justify-center">
          <BookOpen className="w-12 h-12 md:w-16 md:h-16" />
        </div>
        <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 bg-white dark:bg-stone-800 p-1.5 md:p-2 rounded-full shadow-sm">
          <BookOpen className="w-4 h-4 md:w-6 md:h-6 text-primary" />
        </div>
      </div>
      <h4 className="text-lg md:text-xl font-bold font-display text-stone-800 dark:text-stone-100 mb-2 text-center">
        {title}
      </h4>
      <p className="text-sm md:text-base text-stone-500 dark:text-stone-400 max-w-sm text-center mb-8">
        {description}
      </p>

      {showButton && buttonText && (
        <Button
          onClick={onButtonClick}
          disabled={buttonDisabled}
          className="flex items-center gap-2 px-6 md:px-8 py-3 md:py-3.5 bg-primary hover:bg-primary/90 text-white rounded-full font-medium shadow-soft transition-all active:scale-[0.98] cursor-pointer text-sm md:text-base"
        >
          {buttonIcon}
          <span>{buttonText}</span>
        </Button>
      )}
    </div>
  );
}
