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
import { useFilterStore } from '@/store/useFilterStore';
import { useSearchStore } from '@/store/useSearchStore';

export function DashboardHeader() {
  const { view, setView } = useViewStore();
  const { filters, setFilters } = useFilterStore();
  const { searchTerm, setSearchTerm } = useSearchStore();
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  const activeFilterCount = [filters.reading, filters.onShelf, filters.finished].filter(Boolean).length;

  return (
    <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border/40 px-4 sm:px-6 md:px-10 py-3">
      <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-y-3 gap-x-4">
        {/* Left: Branding & Trigger */}
        <div className="flex items-center gap-3 order-1">
          <div className="md:hidden shrink-0">
            <SidebarTrigger />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground font-sans truncate">
            Library
          </h2>
        </div>

        {/* Right: Actions (View Toggle & Filter) */}
        <div className="flex items-center gap-2 sm:gap-4 order-2 md:order-3">
          <div className="flex items-center p-1 rounded-full bg-secondary/30 border border-border/50 shadow-inner overflow-hidden relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setView('grid')}
              className={cn(
                'rounded-full w-7 h-7 sm:w-8 sm:h-8 transition-colors relative z-10 cursor-pointer',
                view === 'grid'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-transparent',
              )}
            >
              <LayoutGrid size={14} className="sm:size-[16px]" />
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
                'rounded-full w-7 h-7 sm:w-8 sm:h-8 transition-colors relative z-10 cursor-pointer',
                view === 'list'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-transparent',
              )}
            >
              <List size={14} className="sm:size-[16px]" />
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
                  'rounded-full w-8 h-8 sm:w-9 sm:h-9 border transition-all active:scale-95 shadow-sm cursor-pointer relative',
                  isFilterOpen
                    ? 'bg-background text-primary border-primary/50'
                    : 'bg-background text-primary hover:bg-primary/10 hover:border-primary/50',
                )}
              >
                <Filter size={14} className="sm:size-4" />
                {activeFilterCount > 0 && !(filters.reading && filters.onShelf && filters.finished) && (
                  <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-primary text-[8px] sm:text-[10px] text-primary-foreground shadow-sm">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-56 sm:w-60 p-4 sm:p-5 rounded-2xl shadow-xl border-border/60 bg-popover mt-2"
            >
              <h4 className="font-display font-bold text-foreground mb-4 text-[14px] sm:text-[15px] tracking-tight">
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

        {/* Middle/Bottom: Search Bar */}
        <div className="relative group flex items-center w-full md:max-w-xs md:ml-4 order-3 md:order-2">
          <Search className="absolute left-3 text-muted-foreground size-4 pointer-events-none transition-colors group-focus-within:text-primary" />
          <Input
            className="w-full pl-9 pr-4 h-10 md:h-9 bg-card dark:bg-stone-800/20 border border-border/80 rounded-full text-sm text-foreground placeholder-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/30 shadow-none transition-all"
            placeholder="Find a book or author..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
    </header>
  );
}
