import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Use Cases — Noted',
  description:
    'Whether you are a student, researcher, or curious reader, discover how Noted adapts to your needs.',
};

export default function UseCasesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
