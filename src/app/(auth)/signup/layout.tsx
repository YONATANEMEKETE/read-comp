import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up - Noted',
  description:
    'Create your Noted account to start your reading journey and build your personal scholarly library.',
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
