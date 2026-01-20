import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ — Noted',
  description:
    'Everything you need to know about using Noted to read, think, and remember better.',
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
