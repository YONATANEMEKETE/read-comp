'use client';

import React from 'react';

interface ReadingPageProps {
  params: Promise<{
    bookId: string;
  }>;
}

export default function ReadingPage({ params }: ReadingPageProps) {
  return (
    <div className="h-full w-full flex items-center justify-center text-muted-foreground">
      Reading View - Book ID will be available here
    </div>
  );
}
