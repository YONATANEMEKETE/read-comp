'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Viewer, PageChangeEvent, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// require CSS
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { useTheme } from 'next-themes';

type Props = {
  fileUrl: string;
  initialPage?: number;
  onPageChange?: (page: number) => void;
};

const PdfReader: React.FC<Props> = ({
  fileUrl,
  initialPage = 0,
  onPageChange,
}) => {
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState(initialPage);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handlePageChange = useCallback(
    (e: PageChangeEvent) => {
      const newPage = e.currentPage;
      
      // Always update local state immediately for smooth rendering
      setCurrentPage(newPage);
      
      // Debounce the callback to parent to prevent excessive re-renders
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      
      debounceRef.current = setTimeout(() => {
        console.log('Page changed to:', newPage);
        onPageChange?.(newPage);
      }, 2000); // 2 seconds debounce
    },
    [onPageChange],
  );

  return (
    <div className="h-full w-full overflow-hidden">
      <Viewer
        fileUrl={fileUrl}
        plugins={[]}
        theme={theme}
        initialPage={initialPage}
        onPageChange={handlePageChange}
        defaultScale={SpecialZoomLevel.PageWidth}
      />
    </div>
  );
};

export default PdfReader;
