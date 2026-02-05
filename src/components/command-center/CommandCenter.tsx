'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import {
  Sun,
  Moon,
  BookOpen,
  Search,
  Heart,
  Library,
  Command,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

type CommandItem = {
  id: string;
  label: string;
  keywords?: string;
  shortcut?: string;
  icon: React.ElementType;
  onSelect: () => void;
};

export function CommandCenter() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [activeIndex, setActiveIndex] = React.useState(0);

  const commands: CommandItem[] = React.useMemo(
    () => [
      {
        id: 'library',
        label: 'Go to Library',
        keywords: 'home read books',
        icon: Library,
        onSelect: () => router.push('/read'),
      },
      {
        id: 'explore',
        label: 'Explore Books',
        keywords: 'discover suggested',
        icon: Search,
        onSelect: () => router.push('/read/explore'),
      },
      {
        id: 'favorites',
        label: 'Favorites',
        keywords: 'stars liked',
        icon: Heart,
        onSelect: () => router.push('/read/favorites'),
      },
      {
        id: 'your-library',
        label: 'Your Library',
        keywords: 'uploads personal',
        icon: BookOpen,
        onSelect: () => router.push('/read/yourlibraries'),
      },
      {
        id: 'toggle-theme',
        label:
          theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
        keywords: 'theme appearance',
        icon: theme === 'dark' ? Sun : Moon,
        onSelect: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
      },
    ],
    [router, theme, setTheme],
  );

  const filtered = commands.filter((c) =>
    `${c.label} ${c.keywords || ''}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  const activeCommand = filtered[activeIndex];

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (!open) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === 'Enter' && activeCommand) {
        e.preventDefault();
        handleSelect(activeCommand);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, filtered, activeCommand]);

  React.useEffect(() => setActiveIndex(0), [query, open]);

  const handleSelect = (cmd: CommandItem) => {
    cmd.onSelect();
    setOpen(false);
    setQuery('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-none bg-transparent shadow-none">
        <VisuallyHidden>
          <DialogTitle>Command Menu</DialogTitle>
        </VisuallyHidden>

        <div className="relative flex flex-col w-full bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden leading-relaxed">
          {/* Header/Input */}
          <div className="relative flex items-center px-4 py-4 border-b border-stone-100 dark:border-stone-800/50">
            <Search className="absolute left-6 h-5 w-5 text-stone-400" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What do you need?"
              className="pl-12 h-10 border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-lg placeholder:text-stone-400 dark:placeholder:text-stone-500 bg-transparent"
            />
          </div>

          {/* Results Area */}
          <div className="max-h-[min(460px,70vh)] overflow-y-auto p-2 scrollbar-thin">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-stone-400">
                <p className="text-sm">No results found for "{query}"</p>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="px-3 py-2 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                  Suggestions
                </div>
                {filtered.map((cmd, idx) => {
                  const isActive = idx === activeIndex;
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={cmd.id}
                      onClick={() => handleSelect(cmd)}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-150 outline-none group',
                        isActive
                          ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-50'
                          : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/50',
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'size-8 rounded-lg flex items-center justify-center transition-colors',
                            isActive
                              ? 'bg-white dark:bg-stone-700 shadow-sm'
                              : 'bg-stone-100 dark:bg-stone-800',
                          )}
                        >
                          <Icon
                            className={cn(
                              'size-4',
                              isActive ? 'text-primary' : 'text-stone-500',
                            )}
                          />
                        </div>
                        <span className="font-medium text-[14px]">
                          {cmd.label}
                        </span>
                      </div>

                      {cmd.shortcut && (
                        <div className="flex items-center gap-1">
                          {cmd.shortcut.split(' ').map((key) => (
                            <kbd
                              key={key}
                              className="min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-[10px] font-medium text-stone-400 uppercase"
                            >
                              {key}
                            </kbd>
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-stone-50/50 dark:bg-stone-800/30 border-t border-stone-100 dark:border-stone-800/50 flex items-center justify-between">
            <div className="flex items-center gap-4 text-[11px] text-stone-400">
              <span className="flex items-center gap-1.5">
                <kbd className="font-sans">↵</kbd> select
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="font-sans">↑↓</kbd> navigate
              </span>
            </div>
            <div className="text-[11px] text-stone-400 uppercase tracking-tight">
              Cmd/Ctrl + K
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
