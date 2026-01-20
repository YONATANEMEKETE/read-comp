import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works — Noted',
  description:
    'Learn how Noted bridges the gap between reading and note-taking to preserve the context of your insights.',
};

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
