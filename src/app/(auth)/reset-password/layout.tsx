import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password - Noted',
  description: 'Create a new password for your Noted account.',
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
