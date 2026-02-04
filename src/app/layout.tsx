import type { Metadata } from 'next';
import { Inter, Noto_Serif } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import { QueryProvider } from '@/components/providers/QueryProvider';
import PdfProvider from '@/components/reading/PdfProvider';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '600', '800', '900'],
  variable: '--font-sans',
  display: 'swap',
});

const notoSerif = Noto_Serif({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Noted - A Quiet Space for Reading',
    template: '%s | Noted',
  },
  description:
    'Read PDFs and write notes without leaving the page. Your thoughts stay connected to the book. A calm reading experience with no context switching.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || 'https://noteed-1.vercel.app',
  ),
  openGraph: {
    title: 'Noted - A Quiet Space for Reading',
    description:
      'Read PDFs and write notes without leaving the page. Your thoughts stay connected to the book.',
    url: '/',
    siteName: 'Noted',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Noted - A Quiet Space for Reading',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Noted - A Quiet Space for Reading',
    description:
      'Read PDFs and write notes without leaving the page. Your thoughts stay connected to the book.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${notoSerif.variable} antialiased font-sans`}
      >
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <PdfProvider>
              <main>{children}</main>
            </PdfProvider>
            <Toaster />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
