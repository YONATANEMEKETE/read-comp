'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const FeaturesCta = () => {
  const transition = { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any };

  return (
    <section className="bg-[#FDFBF7] dark:bg-[#1C1917] py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={transition}
          className="relative overflow-hidden bg-[#1c1917] dark:bg-[#fafaf9] text-[#fafaf9] dark:text-[#1c1917] rounded-[48px] p-12 md:p-24 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-12"
        >
          {/* Ambient Background Glow */}
          <div className="absolute top-0 right-0 w-125 h-125 bg-[#D97706]/20 rounded-full blur-[120px] transform translate-x-1/3 -translate-y-1/3 pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-bold font-sans mb-6 leading-tight">
              Begin your next chapter.
            </h2>
            <p className="text-[#a8a29e] dark:text-[#57534e] text-xl font-light font-sans">
              Step into a more profound way of engaging with the written word.
              Join a community of thinkers today.
            </p>
          </div>

          <div className="relative z-10">
            <Button
              asChild
              className="bg-[#D97706] text-white px-10 py-8 text-sm font-black uppercase tracking-widest hover:bg-[#fafaf9] hover:text-[#1c1917] dark:hover:bg-[#1c1917] dark:hover:text-[#fafaf9] transition-all shadow-2xl rounded-none h-auto cursor-pointer"
            >
              <Link href="/signup">Start Your Journey</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesCta;
