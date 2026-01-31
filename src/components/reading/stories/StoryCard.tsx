'use client';

import React from 'react';
import { Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface StoryCardProps {
  content: string;
  createdAt: Date;
  className?: string;
}

const StoryCard = ({ content, createdAt, className }: StoryCardProps) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast.success('Story copied to clipboard', {
      duration: 2000,
    });
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(createdAt);

  return (
    <div
      className={cn(
        'bg-white dark:bg-[#1c1f26] p-5 rounded-xl shadow-sm border border-stone-100 dark:border-stone-800/60 group hover:shadow-md hover:border-primary/20 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2',
        className,
      )}
    >
      <div className="text-xs text-stone-400 font-medium mb-2">{formattedDate}</div>
      <p className="font-serif text-stone-700 dark:text-stone-300 leading-relaxed text-[15px] mb-4">
        {content}
      </p>
      <div className="pt-3 border-t border-stone-50 dark:border-stone-800 flex justify-end items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className="h-8 w-8 text-stone-300 hover:text-primary transition-colors cursor-pointer"
          title="Copy story"
        >
          <Copy className="w-[18px] h-[18px]" />
        </Button>
      </div>
    </div>
  );
};

export default StoryCard;
