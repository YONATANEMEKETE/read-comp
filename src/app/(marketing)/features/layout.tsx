import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Features — Noted',
  description:
    'Explore the powerful features designed to help you read deeper and think beside the book.',
};

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
