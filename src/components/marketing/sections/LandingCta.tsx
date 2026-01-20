import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const LandingCta = () => {
  return (
    <section className="py-24 md:py-40 bg-[#FDFBF7] dark:bg-[#1C1917] border-t border-[#e7e5e4] dark:border-[#292524]">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 text-center">
        <h2 className="text-4xl sm:text-5xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-[0.9] text-[#1c1917] dark:text-[#fafaf9]">
          Ready to read <br className="hidden md:block" />
          differently?
        </h2>

        <p className="text-lg md:text-3xl font-light text-[#78716c] dark:text-[#a8a29e] mb-16 px-4 font-serif max-w-2xl mx-auto leading-tight">
          Slow down. Focus deeper. <br className="md:hidden" />
          Keep your thoughts close.
        </p>

        <div className="flex flex-col md:flex-row justify-center items-center gap-6 px-4 md:px-0">
          <Button
            asChild
            className="w-full md:w-auto bg-[#D97706] text-white text-lg md:text-xl font-black py-8 px-16 rounded-none uppercase tracking-widest hover:bg-[#1c1917] dark:hover:bg-[#fafaf9] dark:hover:text-[#1c1917] transition-all shadow-xl cursor-pointer h-auto"
          >
            <Link href="/login">Start Reading</Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full md:w-auto border-2 border-[#1c1917] dark:border-[#fafaf9] text-[#1c1917] dark:text-[#fafaf9] text-lg md:text-xl font-black py-8 px-16 rounded-none uppercase tracking-widest hover:bg-[#1c1917] hover:text-white dark:hover:bg-[#fafaf9] dark:hover:text-[#1c1917] transition-all cursor-pointer h-auto bg-transparent shadow-sm"
          >
            <Link href="/how-it-works">How It Works</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LandingCta;
