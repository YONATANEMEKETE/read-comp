import React from 'react';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ResetPasswordPage() {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-6 overflow-hidden bg-warm-bg dark:bg-background-dark">
      <div className="relative w-full max-w-110 z-10">
        {/* Branding Header */}
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-stone-900 dark:text-white text-3xl font-bold tracking-tight font-display">
            Noted
          </h1>
        </div>

        {/* Reset Password Card */}
        <div className="bg-white/70 dark:bg-sidebar-dark/70 backdrop-blur-2xl border border-white dark:border-stone-800 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] dark:shadow-2xl rounded-[2rem] p-8 sm:p-10 transition-all duration-500">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-display font-semibold text-stone-900 dark:text-white mb-2">
              Set New Password
            </h2>
            <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
              Please create a new password for your account. Ensure it is at
              least 8 characters long.
            </p>
          </div>

          <ResetPasswordForm />
        </div>

        <div className="text-center mt-8">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 transition-colors font-medium group"
          >
            <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </Link>
        </div>
      </div>
    </main>
  );
}
