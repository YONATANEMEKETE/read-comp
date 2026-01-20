import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In - Noted',
  description:
    'Sign in to your Noted account to continue your reading journey and access your scholarly library.',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
