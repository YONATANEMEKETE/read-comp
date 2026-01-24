'use client';

import * as React from 'react';
import { Search, LayoutGrid, List, Filter, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useViewStore } from '@/store/useViewStore';

export function DashboardHeader() {
  const { view, setView } = useViewStore();
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [filters, setFilters] = React.useState({
    reading: true,
    onShelf: false,
    finished: false,
  });

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 md:px-10 py-3 bg-background/80 backdrop-blur-sm sticky top-0 z-20 ">
      <div className="flex items-center gap-4 flex-1">
        <div className="md:hidden">
          <SidebarTrigger />
        </div>
        <h2 className="text-xl font-bold text-foreground font-sans">Library</h2>
        <div className="relative group hidden md:flex items-center w-full max-w-xs ml-4">
          <Search className="absolute left-3 text-muted-foreground w-4 h-4 pointer-events-none transition-colors group-focus-within:text-primary" />
          <Input
            className="w-full pl-9 pr-4 h-9 bg-card dark:bg-stone-800/20 border border-border/80 rounded-full text-sm text-foreground placeholder-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/30 shadow-none transition-all"
            placeholder="Find a book or author..."
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center p-1 rounded-full bg-secondary/30 border border-border/50 shadow-inner overflow-hidden relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setView('grid')}
            className={cn(
              'rounded-full w-8 h-8 transition-colors relative z-10 cursor-pointer',
              view === 'grid'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-transparent',
            )}
          >
            <LayoutGrid size={16} />
            {view === 'grid' && (
              <motion.div
                layoutId="view-active"
                className="absolute inset-0 bg-background shadow-sm rounded-full -z-10"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setView('list')}
            className={cn(
              'rounded-full w-8 h-8 transition-colors relative z-10 cursor-pointer',
              view === 'list'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-transparent',
            )}
          >
            <List size={16} />
            {view === 'list' && (
              <motion.div
                layoutId="view-active"
                className="absolute inset-0 bg-background shadow-sm rounded-full -z-10"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
          </Button>
        </div>

        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                'rounded-full w-9 h-9 border transition-all active:scale-95 shadow-sm cursor-pointer',
                isFilterOpen
                  ? 'bg-background text-primary border-primary/50'
                  : 'bg-background text-primary hover:bg-primary/10 hover:border-primary/50',
              )}
            >
              <Filter size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60 p-5 rounded-2xl shadow-xl border-border/60 bg-popover mr-6 mt-2">
            <div className="absolute -top-1.5 right-4 size-2.5 bg-popover border-t border-l border-border/60 rotate-45 transform"></div>
            <h4 className="font-display font-bold text-foreground mb-4 text-[15px] tracking-tight">
              Filter by Status
            </h4>
            <div className="flex flex-col gap-3">
              {[
                { id: 'reading', label: 'Reading' },
                { id: 'onShelf', label: 'On Shelf' },
                { id: 'finished', label: 'Finished' },
              ].map((status) => (
                <label
                  key={status.id}
                  className="flex items-center gap-3 cursor-pointer group select-none"
                >
                  <div
                    className={cn(
                      'size-4 rounded border flex items-center justify-center transition-all',
                      filters[status.id as keyof typeof filters]
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'bg-muted border-muted-foreground/30',
                    )}
                  >
                    {filters[status.id as keyof typeof filters] && (
                      <Check size={12} strokeWidth={3} />
                    )}
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={filters[status.id as keyof typeof filters]}
                    onChange={() =>
                      setFilters((prev) => ({
                        ...prev,
                        [status.id]: !prev[status.id as keyof typeof filters],
                      }))
                    }
                  />
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {status.label}
                  </span>
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
