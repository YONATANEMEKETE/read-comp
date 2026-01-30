'use client';

import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import DetailContent from '@/components/reading/DetailContent';
import { DetailHeader } from '@/components/reading/DetailHeader';
import React from 'react';

interface ReadingPageProps {
  params: Promise<{
    bookId: string;
  }>;
}

export default function ReadingPage({ params }: ReadingPageProps) {
  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <DetailHeader
        title="the art of laziness"
        author="Library mindset"
        totalPages={203}
        currentPage={45}
        isFavorite={true}
        onToggleFavorite={() => {}}
      />
      <div className="flex-1 overflow-hidden">
        <DetailContent />
      </div>
    </div>
  );
}
