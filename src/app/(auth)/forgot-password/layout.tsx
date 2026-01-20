import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Recover Account - Noted',
  description:
    'Enter your email to receive a password reset link for your Noted account.',
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
