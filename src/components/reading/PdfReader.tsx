'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Viewer, PageChangeEvent, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { highlightPlugin, RenderHighlightTargetProps } from '@react-pdf-viewer/highlight';
import SelectionPopover from './SelectionPopover';
import { useQuotes } from '@/hooks/use-quotes';
import { useStories } from '@/hooks/use-stories';

// require CSS
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/highlight/lib/styles/index.css';
import { useTheme } from 'next-themes';

type Props = {
  fileUrl: string;
  initialPage?: number;
  onPageChange?: (page: number) => void;
  bookId?: string;
  isOffline?: boolean;
};

const PdfReader: React.FC<Props> = ({
  fileUrl,
  initialPage = 0,
  onPageChange,
  bookId,
  isOffline = false,
}) => {
  const { theme } = useTheme();
  const [quoteModeText, setQuoteModeText] = useState<string | null>(null);
  const activeSelectionRef = useRef<RenderHighlightTargetProps | null>(null);
  const { saveQuote, isSaving: isSavingQuote } = useQuotes(bookId);
  const { saveStory, isSaving: isSavingStory } = useStories(bookId);

  const handlePageChange = useCallback(
    (e: PageChangeEvent) => {
      const newPage = e.currentPage;
      
      // Call parent immediately - parent handles debouncing
      console.log('Page changed to:', newPage);
      onPageChange?.(newPage);
    },
    [onPageChange],
  );

  const handleAddStory = useCallback(async (text: string) => {
    if (!text.trim()) return;
    await saveStory(text.trim());
    activeSelectionRef.current?.cancel();
    setQuoteModeText(null);
  }, [saveStory]);

  const handleAddQuote = useCallback(async (text: string, author: string) => {
    if (!text.trim()) return;
    await saveQuote(text.trim(), author.trim());
    activeSelectionRef.current?.cancel();
    setQuoteModeText(null);
  }, [saveQuote]);

  const highlightPluginInstance = highlightPlugin({
    renderHighlightTarget: (props) => {
      const { selectedText, selectionRegion, cancel } = props;
      if (!selectedText?.trim()) {
        return <span className="hidden" />;
      }

      activeSelectionRef.current = props;

      return (
        <SelectionPopover
          selectionText={selectedText}
          topPercent={selectionRegion.top}
          leftPercent={selectionRegion.left + selectionRegion.width / 2}
          isQuoteMode={quoteModeText === selectedText}
          isSaving={isSavingQuote || isSavingStory}
          onAddStory={() => handleAddStory(selectedText)}
          onStartQuote={() => setQuoteModeText(selectedText)}
          onSaveQuote={(author) => handleAddQuote(selectedText, author)}
          canSave={!!bookId && !isOffline}
          onCancel={() => {
            setQuoteModeText(null);
            cancel();
          }}
        />
      );
    },
  });

  const plugins = isOffline ? [] : [highlightPluginInstance];

  return (
    <div
      className={`h-full w-full overflow-hidden ${isOffline ? 'select-none' : ''}`}
      style={isOffline ? { userSelect: 'none' } : undefined}
    >
      <Viewer
        fileUrl={fileUrl}
        plugins={plugins}
        theme={theme}
        initialPage={initialPage}
        onPageChange={handlePageChange}
        defaultScale={SpecialZoomLevel.PageWidth}
      />
    </div>
  );
};

export default PdfReader;
