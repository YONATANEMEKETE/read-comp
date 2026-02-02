'use client';

import React, { useState } from 'react';
import { Sparkles, Copy, Check, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface StoryCardProps {
  id: string;
  content: string;
  createdAt: Date;
  className?: string;
  onDelete?: (id: string) => void;
}

const StoryCard = ({ id, content, createdAt, className, onDelete }: StoryCardProps) => {
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success('Story copied to clipboard', {
      duration: 2000,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = () => {
    setIsDeleting(true);
    if (onDelete) {
      onDelete(id);
    }
  };

  if (isDeleting) return null;

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(createdAt);

  return (
    <div
      className={cn(
        'bg-white dark:bg-[#1c1f26] p-6 rounded-xl border border-stone-100 dark:border-stone-800/60 shadow-sm relative group hover:shadow-md hover:border-primary/20 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2',
        className,
      )}
    >
      <div className="absolute top-4 left-4 text-primary/30 dark:text-primary/20">
        <Sparkles className="w-5 h-5 fill-current" />
      </div>

      <div className="pl-7 relative z-10">
        <p className="font-serif text-stone-700 dark:text-stone-300 leading-relaxed text-[15px] mb-4 italic">
          {content}
        </p>
      </div>

      <div className="flex items-center justify-between mt-2 pt-3 border-t border-stone-100 dark:border-stone-800/50">
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
                  className="h-8 w-8 text-stone-300 hover:text-stone-500 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Copy story</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                  className="h-8 w-8 text-stone-300 hover:text-red-400 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Delete story</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <span className="text-[10px] font-medium text-primary bg-stone-50 dark:bg-stone-800/50 px-2 py-1 rounded-md">
          Added on {formattedDate}
        </span>
      </div>
    </div>
  );
};

export default StoryCard;
