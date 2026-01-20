import React from 'react';
import { SignupForm } from '@/components/auth/SignupForm';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-6 overflow-hidden bg-warm-bg dark:bg-background-dark">
      <div className="relative w-full max-w-110 z-10">
        {/* Branding Header */}
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-stone-900 dark:text-white text-3xl font-bold tracking-tight font-display">
            Noted
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm mt-1 font-display italic">
            Your scholarly companion
          </p>
        </div>

        {/* Signup Card */}
        <div className="bg-white/70 dark:bg-sidebar-dark/70 backdrop-blur-2xl border border-white dark:border-stone-800 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] dark:shadow-2xl rounded-[2rem] p-8 sm:p-10 transition-all duration-500">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-display font-semibold text-stone-900 dark:text-white mb-2">
              Start Your Journey
            </h2>
            <p className="text-stone-500 dark:text-stone-400 text-sm">
              Your personal library awaits.
            </p>
          </div>

          <SignupForm />

          <div className="mt-8 pt-6 border-t border-dashed border-sepia-divider dark:border-stone-800 text-center">
            <p className="text-stone-500 dark:text-stone-400 text-sm">
              Already a member?
              <Link
                href="/login"
                className="text-primary font-bold hover:text-primary/80 transition-colors ml-1.5 underline decoration-primary/20 underline-offset-4 hover:decoration-primary"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom Quote */}
        <div className="mt-10 text-center opacity-40 hover:opacity-100 transition-opacity duration-700 cursor-default">
          <p className="text-stone-500 dark:text-stone-400 text-xs font-display italic tracking-wide">
            © 2025 Noted Library
          </p>
        </div>
      </div>
    </main>
  );
}
