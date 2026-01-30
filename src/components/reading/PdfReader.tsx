'use client';

import React from 'react';
import { Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// require CSS
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

type Props = {
  fileUrl: string;
};

const PdfReader: React.FC<Props> = ({ fileUrl }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div className="h-full w-full">
      <Viewer fileUrl={fileUrl} plugins={[]} />
    </div>
  );
};

export default PdfReader;
