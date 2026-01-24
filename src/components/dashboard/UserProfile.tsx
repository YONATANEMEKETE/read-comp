'use client';

import * as React from 'react';
import { LogOut, Sun, Moon, ChevronUp } from 'lucide-react';
import { useSession, signOut } from '@/lib/auth-client';
import { useTheme } from 'next-themes';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function UserProfile() {
  const { data: session, isPending } = useSession();
  const { theme, setTheme } = useTheme();

  if (isPending) {
    return (
      <SidebarMenuButton
        size="lg"
        className="flex items-center gap-3 px-3 py-2.5 h-auto rounded-xl bg-sidebar-accent/50 border border-sidebar-border/50 pointer-events-none"
      >
        <Skeleton className="h-9 w-9 rounded-full shrink-0" />
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <Skeleton className="h-3.5 w-24 rounded-md" />
          <Skeleton className="h-2.5 w-16 rounded-md" />
        </div>
        <ChevronUp size={18} className="text-sidebar-foreground/40" />
      </SidebarMenuButton>
    );
  }

  const user = session?.user;
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="flex items-center gap-3 px-3 py-2.5 h-auto rounded-xl bg-sidebar-accent/50 border border-sidebar-border/50 cursor-pointer transition-all hover:shadow-soft hover:bg-sidebar-accent/80 group data-[state=open]:bg-sidebar-accent text-sidebar-foreground"
        >
          <Avatar className="size-9 border border-sidebar-border/30 shadow-sm transition-transform duration-200 group-hover:scale-105">
            <AvatarImage src={user?.image || undefined} />
            <AvatarFallback className="bg-sidebar-primary/20 text-sidebar-primary font-bold text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0 flex-1 text-left">
            <span className="text-sm font-semibold text-sidebar-foreground truncate">
              {user?.name || 'Guest User'}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-sidebar-foreground/50 truncate text-left">
              {user?.email || 'Welcome'}
            </span>
          </div>
          <ChevronUp
            size={18}
            className="text-sidebar-foreground/40 transition-transform duration-200 group-hover:text-sidebar-foreground group-data-[state=open]:rotate-180"
          />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        align="center"
        className="w-60 p-0 mb-3 rounded-2xl border-sidebar-border shadow-xl overflow-hidden bg-popover/95 backdrop-blur-md text-popover-foreground"
        sideOffset={12}
      >
        <div className="p-3 bg-muted/40">
          <DropdownMenuLabel className="p-0 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2.5 text-left">
            Appearance
          </DropdownMenuLabel>
          <div className="flex bg-muted p-1 rounded-xl gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setTheme('light');
              }}
              className={cn(
                'flex-1 h-8 text-xs font-semibold rounded-lg transition-all cursor-pointer',
                theme === 'light'
                  ? 'bg-popover hover:bg-popover shadow-sm text-foreground border border-border/20'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Sun size={14} className="mr-1.5" />
              Light
            </Button>
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setTheme('dark');
              }}
              className={cn(
                'flex-1 h-8 text-xs font-semibold rounded-lg transition-all cursor-pointer',
                theme === 'dark'
                  ? 'shadow-sm text-foreground border border-border/20'
                  : 'text-muted-foreground hover:text-foreground bg-transparent hover:bg-transparent',
              )}
            >
              <Moon size={14} className="mr-1.5" />
              Dark
            </Button>
          </div>
        </div>

        <DropdownMenuSeparator className="bg-border/60 m-0" />

        <div className="p-1">
          <DropdownMenuItem
            onClick={() => signOut()}
            className="gap-3 px-3 py-2 rounded-xl text-muted-foreground focus:bg-destructive/10 focus:text-destructive transition-all font-medium cursor-pointer group"
          >
            <LogOut
              size={18}
              className="group-focus:text-destructive transition-colors"
            />
            <span className="text-sm">Log Out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
