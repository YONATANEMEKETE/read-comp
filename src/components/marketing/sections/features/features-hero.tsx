'use client';

import React from 'react';
import { motion } from 'motion/react';

const FeaturesHero = () => {
  const transition = { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any };

  return (
    <section className="bg-[#FDFBF7] dark:bg-[#1C1917] pt-32 pb-20 px-6 lg:px-12 text-center overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition}
          className="text-5xl md:text-7xl font-black tracking-tighter text-[#1c1917] dark:text-[#fafaf9] mb-8 uppercase leading-[0.9] text-center"
        >
          The Narrative of a Deeper Read.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: 0.1 }}
          className="text-lg md:text-2xl text-[#78716c] dark:text-[#a8a29e] leading-relaxed font-light font-sans max-w-2xl mx-auto"
        >
          Discover a rhythm of reading where every insight is captured and every
          question is answered. Follow the journey from raw text to lasting
          wisdom.
        </motion.p>
      </div>
    </section>
  );
};

export default FeaturesHero;
