import React from 'react';
import { Quote, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface QuoteCardProps {
  text: string;
  author: string;
  className?: string;
}

const QuoteCard = ({ text, author, className }: QuoteCardProps) => {
  return (
    <div
      className={cn(
        'bg-white dark:bg-[#1a1816] p-5 rounded-xl border border-stone-100 dark:border-stone-800 shadow-paper relative group hover:shadow-soft transition-all duration-300',
        className,
      )}
    >
      <div className="absolute top-4 left-4 text-stone-300 dark:text-stone-600">
        <Quote className="w-5 h-5 fill-current" />
      </div>
      <p className="font-serif text-stone-800 dark:text-stone-300 leading-relaxed mb-4 pl-6 relative z-10 italic">
        &quot;{text}&quot;
      </p>
      <div className="flex items-center justify-between mt-2 pt-3 border-t border-stone-100 dark:border-stone-800/50">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-stone-300 hover:text-stone-500 transition-colors cursor-pointer"
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
        <span className="text-[10px] font-medium text-primary bg-stone-50 dark:bg-stone-800/50 px-2 py-1 rounded-md">
          Quoted by {author}
        </span>
      </div>
    </div>
  );
};

export default QuoteCard;
