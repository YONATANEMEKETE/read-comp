'use client';

import * as React from 'react';
import { Search, LayoutGrid, List, Filter, Check } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';

export function DashboardHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = (searchParams.get('view') as 'grid' | 'list') || 'grid';

  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [filters, setFilters] = React.useState({
    reading: true,
    onShelf: false,
    finished: false,
  });

  const setView = (newView: 'grid' | 'list') => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', newView);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 md:px-10 py-6 bg-warm-bg/80 dark:bg-background-dark/90 backdrop-blur-sm sticky top-0 z-20 transition-all duration-300">
      <div className="flex items-center gap-8 flex-1">
        <div className="md:hidden">
          <SidebarTrigger />
        </div>
        <h2 className="text-2xl font-bold text-stone-900 dark:text-white tracking-tight font-display italic">
          Library
        </h2>
        <div className="relative group hidden md:flex items-center w-full max-w-md">
          <Search className="absolute left-4 text-stone-400 w-5 h-5 pointer-events-none transition-colors group-focus-within:text-primary" />
          <Input
            className="w-full pl-11 pr-12 py-5 bg-white dark:bg-stone-800/40 border-none rounded-full text-sm text-stone-700 dark:text-stone-200 placeholder-stone-400 focus-visible:ring-2 focus-visible:ring-primary/20 shadow-inner-soft transition-all"
            placeholder="Find a book or author..."
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center p-1 rounded-full bg-stone-100 dark:bg-stone-800/50 border border-sepia-divider/40">
          <button
            onClick={() => setView('grid')}
            className={cn(
              'p-2 rounded-full transition-all duration-200 cursor-pointer',
              view === 'grid'
                ? 'bg-white dark:bg-stone-700 shadow-soft text-primary'
                : 'text-stone-400 hover:text-stone-900 dark:hover:text-stone-200',
            )}
          >
            <LayoutGrid className="h-5 w-5" />
          </button>
          <button
            onClick={() => setView('list')}
            className={cn(
              'p-2 rounded-full transition-all duration-200 cursor-pointer',
              view === 'list'
                ? 'bg-white dark:bg-stone-700 shadow-soft text-primary'
                : 'text-stone-400 hover:text-stone-900 dark:hover:text-stone-200',
            )}
          >
            <List className="h-5 w-5" />
          </button>
        </div>

        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <button
              className={cn(
                'size-10 rounded-full flex items-center justify-center transition-all cursor-pointer border',
                isFilterOpen
                  ? 'bg-primary text-white border-primary'
                  : 'bg-primary/10 text-primary border-sepia-divider/50 hover:bg-primary/20',
              )}
            >
              <Filter className="h-5 w-5" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-60 p-5 rounded-2xl shadow-xl border-border/60 bg-popover mr-6 mt-2">
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
