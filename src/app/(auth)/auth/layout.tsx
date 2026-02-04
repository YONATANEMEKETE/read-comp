import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In - Noted',
  description:
    'Sign in to your Noted account to continue your reading journey and access your scholarly library.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
