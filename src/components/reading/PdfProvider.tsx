// components/PdfProvider.tsx
'use client';

import { Worker } from '@react-pdf-viewer/core';

interface PdfProviderProps {
  children: React.ReactNode;
}

export default function PdfProvider({ children }: PdfProviderProps) {
  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/legacy/build/pdf.worker.min.js">
      {children}
    </Worker>
  );
}
