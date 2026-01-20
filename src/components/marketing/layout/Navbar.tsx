'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScreenSize } from '@/hooks/use-screen-size';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isMobile } = useScreenSize();

  // Auto-close menu when resizing to desktop
  useEffect(() => {
    if (!isMobile && isOpen) {
      setIsOpen(false);
    }
  }, [isMobile, isOpen]);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'How It Works', href: '#' },
    { name: 'Features', href: '#' },
    { name: 'Use Cases', href: '#' },
    { name: 'FAQ', href: '#' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#FDFBF7]/95 dark:bg-[#1C1917]/95 backdrop-blur-sm border-b border-[#e7e5e4]/60 dark:border-[#292524]/60">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-12">
            <Link
              href="/"
              className="text-xl font-black tracking-tighter uppercase text-[#1c1917] dark:text-[#fafaf9]"
            >
              Noted.
            </Link>
            <div className="hidden md:flex items-center space-x-8 text-[11px] font-bold uppercase tracking-widest text-[#78716c] dark:text-[#a8a29e]">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="hover:text-[#D97706] transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Button
              variant="ghost"
              className="text-xs font-bold uppercase tracking-wider text-[#1c1917] dark:text-[#fafaf9] hover:text-[#D97706] dark:hover:text-[#D97706] hover:bg-transparent transition-colors h-auto p-0 cursor-pointer"
            >
              Log in
            </Button>
            <Button className="bg-[#1c1917] dark:bg-[#fafaf9] text-white dark:text-[#1c1917] px-5 py-2 h-auto rounded-none text-xs font-black uppercase tracking-widest hover:bg-[#D97706] dark:hover:bg-[#D97706] dark:hover:text-white transition-all cursor-pointer">
              Join
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-[#1c1917] dark:text-[#fafaf9] hover:bg-transparent cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="size-7" /> : <Menu className="size-7" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-[#FDFBF7] dark:bg-[#1C1917] border-b border-[#e7e5e4] dark:border-[#292524] shadow-xl px-6 py-8 flex flex-col space-y-6 md:hidden h-[calc(100vh-4rem)] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col space-y-6 text-sm font-bold uppercase tracking-widest text-[#57534e] dark:text-[#d6d3d1]">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="hover:text-[#D97706] transition-colors py-2 border-b border-[#f5f5f4] dark:border-[#292524]/50"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-6 border-t border-[#e7e5e4] dark:border-[#292524] flex flex-col space-y-4">
            <Button
              variant="ghost"
              className="text-sm font-bold uppercase tracking-wider text-[#1c1917] dark:text-[#fafaf9] hover:text-[#D97706] dark:hover:text-[#D97706] hover:bg-transparent transition-colors py-2 text-left justify-start h-auto px-0 cursor-pointer"
            >
              Log in
            </Button>
            <Button className="w-full bg-[#1c1917] dark:bg-[#fafaf9] text-white dark:text-[#1c1917] px-5 py-4 rounded-none text-sm font-black uppercase tracking-widest hover:bg-[#D97706] dark:hover:bg-[#D97706] dark:hover:text-white transition-all text-center h-auto cursor-pointer">
              Join Noted
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
