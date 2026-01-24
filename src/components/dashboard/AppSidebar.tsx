'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { BookOpenText, Library, Heart, Upload, Settings } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { UserProfile } from './UserProfile';
import { cn } from '@/lib/utils';
import { Logo } from '../common/Logo';

const navItems = [
  {
    title: 'All Books',
    href: '/read',
    icon: Library,
  },
  {
    title: 'Your Books',
    href: '/read/yourlibraries',
    icon: BookOpenText,
  },
  {
    title: 'Favorites',
    href: '/read/favorites',
    icon: Heart,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar/50 backdrop-blur-md">
      <SidebarHeader className="p-6 pb-4 border-b border-sidebar-border/50">
        <Link href="/" className="flex gap-3 items-center">
          <Logo />
          <div className="flex flex-col">
            <h1 className="text-sidebar-foreground text-2xl font-bold tracking-tight font-sans">
              Noted
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-sidebar-foreground/50 -mt-1">
              Companion
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarGroup className="py-4">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className={cn(
                      'px-2.5 py-1.5 rounded-lg transition-colors duration-200 h-auto border border-transparent cursor-pointer',
                      pathname === item.href
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold'
                        : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground',
                    )}
                  >
                    <Link href={item.href} className="flex items-center gap-3">
                      <item.icon
                        size={20}
                        className={cn(
                          'transition-colors',
                          pathname === item.href
                            ? 'text-sidebar-primary'
                            : 'text-sidebar-foreground/40',
                        )}
                      />
                      <span className="text-sm">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="my-2 border-t border-sidebar-border/50 opacity-50" />

        <div className="px-2 pt-2 pb-2">
          <Button className="w-full h-10 rounded-xl bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground text-sm font-semibold shadow-sm transition-all active:scale-[0.98] gap-2.5 group border-none cursor-pointer">
            <Upload size={16} />
            <span>Upload PDF</span>
          </Button>
        </div>
      </SidebarContent>

      <SidebarFooter className="pb-6 pt-6 gap-2 border-t border-sidebar-border/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="px-2.5 py-2 h-auto rounded-lg text-sidebar-foreground/60 hover:bg-sidebar-accent/50 transition-colors font-medium border border-transparent cursor-pointer"
            >
              <Link href="/read/settings" className="flex items-center gap-3">
                <Settings size={18} className="text-sidebar-foreground/40" />
                <span className="text-sm">Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem className="mt-2 text-left">
            <UserProfile />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
