'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ListFilter } from 'lucide-react';
import { motion } from 'motion/react';

const LandingHero = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-24 pb-12 bg-[#FDFBF7] dark:bg-[#1C1917] overflow-hidden">
      {/* Ambient Background Elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#D97706]/10 dark:bg-[#D97706]/5 rounded-full blur-[100px] pointer-events-none"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
        className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-[#B45309]/10 dark:bg-[#B45309]/5 rounded-full blur-[80px] pointer-events-none"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.4 }}
        className="absolute top-[30%] right-[10%] w-[15%] h-[15%] bg-[#D97706]/5 dark:bg-[#D97706]/5 rounded-full blur-[60px] pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 max-w-screen-xl w-full flex flex-col items-center text-center"
      >
        {/* Abstract Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
          animate={{ opacity: 0.9, scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: 'spring', bounce: 0.4, delay: 0.2 }}
          className="mb-8 md:mb-12 relative"
        >
          <div
            className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center opacity-90 transition-transform hover:rotate-3"
            style={{
              background: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
              clipPath: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)',
            }}
          >
            <ListFilter className="text-white size-10 md:size-12" />
          </div>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter text-[#1c1917] dark:text-[#fafaf9] mb-6 md:mb-8 uppercase max-w-5xl px-2 leading-[0.95]"
        >
          READ. THINK. NOTE.
          <br />
          <span className="text-[#D97706] block mt-2 md:mt-0 md:inline">
            ALL IN ONE PLACE.
          </span>
        </motion.h1>

        {/* Hero Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-2xl font-light text-[#78716c] dark:text-[#a8a29e] max-w-3xl mb-12 leading-tight px-4 font-serif"
        >
          Read PDFs and write notes without leaving the page. Your thoughts stay
          connected to the book.
        </motion.p>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="w-full max-w-md px-4"
        >
          <Button
            asChild
            className="w-full bg-[#1c1917] dark:bg-[#fafaf9] text-white dark:text-[#1c1917] text-lg md:text-xl font-black py-8 md:py-10 uppercase tracking-widest hover:bg-[#D97706] dark:hover:bg-[#D97706] dark:hover:text-white transition-all shadow-2xl hover:scale-[1.01] active:scale-[0.99] rounded-none cursor-pointer"
          >
            <Link href="/login">Start Reading</Link>
          </Button>
          <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#a8a29e]">
            Calm reading, no context switching
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default LandingHero;
