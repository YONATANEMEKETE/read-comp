'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';

const Cta = () => {
  return (
    <section className="bg-[#FDFBF7] dark:bg-[#1C1917] pb-24 md:pb-32 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden bg-[#1c1917] dark:bg-[#fafaf9] text-[#fafaf9] dark:text-[#1c1917] rounded-3xl p-10 md:p-20 text-center"
        >
          {/* Ambient Background Element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D97706] rounded-full blur-[100px] opacity-20 transform translate-x-1/3 -translate-y-1/3 pointer-events-none" />

          <div className="relative z-10 max-w-lg mx-auto">
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl md:text-4xl font-serif mb-6 leading-tight"
            >
              Ready to experience it?
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-[#a8a29e] dark:text-[#57534e] mb-10 font-sans tracking-tight"
            >
              Join thousands of readers who are reading more thoughtfully and
              capturing insights more effectively.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button
                asChild
                className="bg-[#D97706] text-white px-8 md:px-12 py-6 md:py-8 font-black uppercase tracking-widest hover:bg-[#fafaf9] hover:text-[#1c1917] dark:hover:bg-[#1c1917] dark:hover:text-[#fafaf9] transition-all shadow-xl rounded-none text-xs md:text-sm h-auto cursor-pointer"
              >
                <Link href="/login">Start Reading Now</Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Cta;
