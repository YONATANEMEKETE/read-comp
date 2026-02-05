'use client';

import React, { useMemo, useState } from 'react';
import { Quote, Sparkles, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SelectionPopoverProps {
  selectionText: string;
  topPercent: number;
  leftPercent: number;
  isQuoteMode: boolean;
  isSaving?: boolean;
  canSave?: boolean;
  onAddStory: () => void;
  onStartQuote: () => void;
  onSaveQuote: (author: string) => void;
  onCancel: () => void;
}

const clampPercent = (value: number, min = 6, max = 94) =>
  Math.min(max, Math.max(min, value));

const SelectionPopover = ({
  selectionText,
  topPercent,
  leftPercent,
  isQuoteMode,
  isSaving = false,
  canSave = true,
  onAddStory,
  onStartQuote,
  onSaveQuote,
  onCancel,
}: SelectionPopoverProps) => {
  const [author, setAuthor] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const isLongSelection = selectionText.trim().length > 220;

  const positionStyle = useMemo(() => {
    return {
      top: `${clampPercent(topPercent) - 1.5}%`,
      left: `${clampPercent(leftPercent)}%`,
    } as React.CSSProperties;
  }, [topPercent, leftPercent]);

  return (
    <div
      className="rpv-highlight__target absolute z-50"
      style={positionStyle}
      onMouseDown={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      onMouseUp={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <div
        className={cn(
          'relative -translate-x-1/2 -translate-y-full rounded-2xl border border-sepia-divider/80 dark:border-stone-700 bg-[#f6f2ea] dark:bg-[#1b1a17] shadow-book px-3.5 py-3 min-w-[240px] max-w-[320px] select-none',
          'animate-in fade-in zoom-in-95 duration-200'
        )}
      >
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-4 w-4 rotate-45 bg-[#f6f2ea] dark:bg-[#1b1a17] border-b border-r border-sepia-divider/80 dark:border-stone-700" />

        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="text-[10px] uppercase tracking-[0.2em] text-stone-400">
            Capture Selection
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onCancel}
            className="h-7 w-7 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div
          className={cn(
            'text-xs text-stone-600 dark:text-stone-300 font-serif italic mb-2 relative',
            isExpanded ? 'max-h-48 overflow-y-auto pr-1' : 'max-h-16 overflow-hidden'
          )}
        >
          &quot;{selectionText}&quot;
          {!isExpanded && isLongSelection && (
            <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-[#f6f2ea] dark:from-[#1b1a17] to-transparent" />
          )}
        </div>
        {!isExpanded && isLongSelection && (
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="text-[10px] uppercase tracking-[0.18em] text-primary/80 hover:text-primary mb-2"
          >
            Show full selection
          </button>
        )}
        {isExpanded && isLongSelection && (
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="text-[10px] uppercase tracking-[0.18em] text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 mb-2"
          >
            Collapse
          </button>
        )}

        {!isQuoteMode ? (
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              className="flex-1 h-9 rounded-full text-xs font-semibold bg-primary/15 text-primary hover:bg-primary/25"
              onClick={onAddStory}
              disabled={isSaving || !canSave}
            >
              <Sparkles className="h-4 w-4" />
              Add Story
            </Button>
            <Button
              className="flex-1 h-9 rounded-full text-xs font-semibold"
              onClick={onStartQuote}
              disabled={isSaving || !canSave}
            >
              <Quote className="h-4 w-4" />
              Add Quote
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2 rounded-full border border-sepia-divider/80 dark:border-stone-700 bg-white dark:bg-[#25221e] px-3 h-9">
              <Quote className="h-4 w-4 text-stone-400" />
              <Input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Cited by..."
                className="border-none bg-transparent text-xs font-serif text-stone-700 dark:text-stone-200 focus-visible:ring-0 h-8 p-0"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                className="flex-1 h-9 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-200"
                onClick={() => setAuthor('')}
                disabled={isSaving || !canSave}
              >
                Reset
              </Button>
              <Button
                className="flex-1 h-9 rounded-full text-xs font-semibold"
                onClick={() => onSaveQuote(author)}
                disabled={isSaving || !canSave}
              >
                <Check className="h-4 w-4" />
                Save Quote
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectionPopover;
