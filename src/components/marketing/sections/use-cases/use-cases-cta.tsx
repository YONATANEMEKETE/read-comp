'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';

const UseCasesCta = () => {
  const transition = { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any };

  return (
    <section className="bg-[#FDFBF7] dark:bg-[#1C1917] py-24 md:py-40 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={transition}
          className="relative overflow-hidden bg-stone-900 dark:bg-[#fafaf9] text-[#fafaf9] dark:text-[#1c1917] rounded-[48px] p-10 md:p-32 text-center"
        >
          {/* Ambient Background Element */}
          <div className="absolute top-0 right-0 w-125 h-125 bg-[#D97706] rounded-full blur-[150px] opacity-10 transform translate-x-1/3 -translate-y-1/3 pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...transition, delay: 0.2 }}
              className="text-4xl md:text-8xl font-black uppercase tracking-tighter mb-10 leading-[0.9] text-center"
            >
              Whatever you read,
              <br />
              make it yours.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...transition, delay: 0.3 }}
              className="text-xl md:text-3xl font-light text-stone-400 dark:text-stone-500 mb-16 max-w-2xl mx-auto font-serif"
            >
              Join thousands of thinkers who have changed the way they read,
              connecting every highlight to a broader world of knowledge.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ ...transition, delay: 0.4 }}
            >
              <Button
                asChild
                className="bg-[#D97706] text-white px-10 md:px-20 py-8 md:py-10 text-lg md:text-xl font-black uppercase tracking-widest hover:bg-white hover:text-stone-900 dark:hover:bg-stone-900 dark:hover:text-white transition-all shadow-2xl rounded-none h-auto cursor-pointer"
              >
                <Link href="/login">Get Started Free</Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default UseCasesCta;
