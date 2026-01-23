'use client';

import React from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

export default function LibraryPage() {
  return (
    <div className="flex flex-col h-full w-full">
      <DashboardHeader />
      <div className="flex-1 overflow-y-auto px-6 md:px-10 pb-20 scroll-smooth">
        {/* Content will go here */}
        <div className="h-full flex items-center justify-center text-muted-foreground">
          Content Area
        </div>
      </div>
    </div>
  );
}
