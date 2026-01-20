'use client';

import React from 'react';
import { motion } from 'motion/react';

const HeroHow = () => {
  return (
    <section className="relative  flex flex-col items-center px-6 pt-32 pb-10 bg-[#FDFBF7] dark:bg-[#1C1917] overflow-hidden">
      <div className="relative z-10 max-w-4xl w-full flex flex-col items-start text-start">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[#D97706] font-black tracking-[0.3em] uppercase text-xs mb-6 block"
        >
          Reading Companion
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-black tracking-tighter text-[#1c1917] dark:text-[#fafaf9] mb-8 uppercase leading-[0.95]"
        >
          How It Works
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-[#78716c] dark:text-[#a8a29e] max-w-2xl font-light font-serif leading-relaxed"
        >
          A simple workflow designed to help you read deeper and retain more.
          Here is how Noted transforms your reading list into a knowledge base.
        </motion.p>
      </div>
    </section>
  );
};

export default HeroHow;
