import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Noted - A Quiet Space for Reading';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
        }}
      >
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: '20px',
            letterSpacing: '-2px',
          }}
        >
          Noted
        </div>
        <div
          style={{
            fontSize: 36,
            color: '#e8e8e8',
            textAlign: 'center',
            maxWidth: '800px',
          }}
        >
          A Quiet Space for Thoughtful Reading
        </div>
        <div
          style={{
            fontSize: 24,
            color: '#a0a0a0',
            marginTop: '30px',
            textAlign: 'center',
          }}
        >
          Read PDFs and write notes without leaving the page
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
