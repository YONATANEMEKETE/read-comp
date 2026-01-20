'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';

const LandingCta = () => {
  const transition = { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any };

  return (
    <section className="py-24 md:py-40 bg-[#FDFBF7] dark:bg-[#1C1917] border-t border-[#e7e5e4] dark:border-[#292524]">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={transition}
        className="max-w-7xl mx-auto px-6 lg:px-12 text-center"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...transition, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-[0.9] text-[#1c1917] dark:text-[#fafaf9]"
        >
          Ready to read <br className="hidden md:block" />
          differently?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...transition, delay: 0.3 }}
          className="text-lg md:text-3xl font-light text-[#78716c] dark:text-[#a8a29e] mb-16 px-4 font-serif max-w-2xl mx-auto leading-tight"
        >
          Slow down. Focus deeper. <br className="md:hidden" />
          Keep your thoughts close.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ ...transition, delay: 0.4 }}
          className="flex flex-col md:flex-row justify-center items-center gap-6 px-4 md:px-0"
        >
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
        </motion.div>
      </motion.div>
    </section>
  );
};

export default LandingCta;
