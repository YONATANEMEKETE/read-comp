import type { Metadata } from 'next';
import { Inter, Noto_Serif } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

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
  title: 'Noted - A Quiet Space for Reading',
  description:
    'Read PDFs and write notes without leaving the page. Your thoughts stay connected to the book. A calm reading experience with no context switching.',
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
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
