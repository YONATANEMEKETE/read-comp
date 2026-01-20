'use client';

import React from 'react';
import { motion } from 'motion/react';

const HeroUseCases = () => {
  const transition = { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any };

  return (
    <section className="relative flex flex-col items-center px-6 pt-32 pb-20 bg-[#FDFBF7] dark:bg-[#1C1917] overflow-hidden">
      {/* Ambient Background Elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#D97706]/10 dark:bg-[#D97706]/5 rounded-full blur-[100px] pointer-events-none"
      />

      <div className="relative z-10 max-w-7xl w-full flex flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: 0.1 }}
          className="text-[#D97706] font-black tracking-[0.3em] uppercase text-[10px] mb-6 block"
        >
          Who is Noted for?
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: 0.2 }}
          className="text-5xl md:text-7xl font-black tracking-tighter text-[#1c1917] dark:text-[#fafaf9] mb-8 uppercase leading-[0.9] text-center"
        >
          BUILT FOR DEEP
          <br />
          THINKERS.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: 0.3 }}
          className="text-xl md:text-2xl text-[#78716c] dark:text-[#a8a29e] max-w-3xl font-light font-serif leading-relaxed"
        >
          Whether you&apos;re studying for a degree or learning for life, Noted
          adapts to your reading style and helps you retain what matters.
        </motion.p>
      </div>
    </section>
  );
};

export default HeroUseCases;
