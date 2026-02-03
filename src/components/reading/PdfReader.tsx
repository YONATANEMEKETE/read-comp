'use client';

import React, { useState, useCallback } from 'react';
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

  const handlePageChange = useCallback(
    (e: PageChangeEvent) => {
      const newPage = e.currentPage;
      
      // Update local state immediately for smooth rendering
      setCurrentPage(newPage);
      
      // Call parent immediately - parent handles debouncing
      console.log('Page changed to:', newPage);
      onPageChange?.(newPage);
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
