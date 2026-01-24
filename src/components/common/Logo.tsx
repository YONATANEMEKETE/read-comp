'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function Logo({ width = 40, height = 40, className }: LogoProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, systemTheme } = useTheme();

  // Only render theme-dependent content after mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine the actual theme (handle system preference)
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  // Show default logo during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className={className}>
        <Image
          src="/logo.png"
          alt="Noted Logo"
          width={width}
          height={height}
          priority
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <Image
        src={isDark ? '/logo-white.png' : '/logo.png'}
        alt="Noted Logo"
        width={width}
        height={height}
        priority
      />
    </div>
  );
}
