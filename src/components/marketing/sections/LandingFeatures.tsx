'use client';

import React from 'react';
import { motion } from 'motion/react';

const features = [
  {
    title: 'Read.',
    description:
      'A clean, distraction-free reading experience designed for long sessions and deep focus.',
  },
  {
    title: 'Note.',
    description:
      'Capture thoughts, ideas, and questions right where they happen without leaving the page.',
  },
  {
    title: 'Remember.',
    description:
      'Everything you write stays connected to the book, ready whenever you return.',
  },
];

const LandingFeatures = () => {
  const transition = { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any };

  return (
    <div className="bg-[#FDFBF7] dark:bg-[#1C1917]">
      {/* Three Column Features */}
      <section className="py-20 md:py-32 border-t border-[#e7e5e4] dark:border-[#292524]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ ...transition, delay: index * 0.1 }}
              className="text-center md:text-left group"
            >
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-[#1c1917] dark:text-[#fafaf9] transition-transform group-hover:translate-x-1">
                {feature.title}
              </h2>
              <p className="text-[#78716c] dark:text-[#a8a29e] text-lg font-medium leading-relaxed max-w-sm mx-auto md:mx-0">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* High-Impact Highlight Section */}
      <section className="bg-[#1c1917] text-[#fafaf9] py-24 md:py-40 overflow-hidden relative">
        {/* Subtle decorative element */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: transition.ease }}
          className="absolute top-0 right-0 w-1/3 h-full bg-[#D97706]/5 skew-x-[-12deg] translate-x-1/2 pointer-events-none"
        />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-16 text-center md:text-left relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={transition}
            className="md:w-3/5"
          >
            <span className="inline-block text-xs font-black uppercase tracking-[0.3em] text-[#D97706] mb-6">
              Why Noted
            </span>
            <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-10">
              LESS FRICTION.
              <br />
              <span className="text-[#78716c]">MORE FOCUS.</span>
            </h2>
            <div className="space-y-6">
              <p className="text-xl md:text-3xl font-light text-[#a8a29e] leading-tight max-w-2xl">
                Noted keeps reading and thinking together so you stay in the
                flow.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ ...transition, delay: 0.2 }}
            className="w-full md:w-1/3 text-center md:text-right border-t md:border-t-0 border-[#292524] pt-12 md:pt-0"
          >
            <p className="text-2xl md:text-4xl font-light italic leading-tight text-[#fafaf9]/80 font-serif">
              “Understanding comes from staying present.”
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingFeatures;
