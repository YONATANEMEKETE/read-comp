'use client';

import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DetailHeader } from '@/components/reading/DetailHeader';
import React from 'react';

interface ReadingPageProps {
  params: Promise<{
    bookId: string;
  }>;
}

export default function ReadingPage({ params }: ReadingPageProps) {
  return (
    <div className="h-full w-full">
      <DetailHeader
        title="the art of laziness"
        author="Library mindset"
        totalPages={203}
        currentPage={45}
        isFavorite={true}
        onToggleFavorite={() => {}}
      />
    </div>
  );
}
