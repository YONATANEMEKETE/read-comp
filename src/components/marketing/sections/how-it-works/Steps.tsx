'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  Upload,
  Sparkles,
  Quote,
  Bookmark,
  FileText,
  History,
  Share2,
} from 'lucide-react';

const steps = [
  {
    order: 'Step 01',
    title: 'Curate your Library',
    description:
      'Upload your personal collection of textbooks, research papers, or non-fiction PDFs. Organize your reading list in one focused library.',
    icon: <Upload className="size-8 text-[#a8a29e]" />,
    visual: (
      <div className="w-48 h-32 border-2 border-dashed border-[#e7e5e4] dark:border-[#292524] rounded-lg flex flex-col items-center justify-center gap-3 bg-[#FDFBF7]/50 dark:bg-[#1C1917]/50 backdrop-blur-sm z-10 transition-transform group-hover:scale-105 duration-500">
        <FileText className="size-10 text-[#a8a29e]" />
        <div className="h-1.5 w-16 bg-[#e7e5e4] dark:bg-[#292524] rounded-full overflow-hidden">
          <div className="h-full bg-[#D97706] w-2/3" />
        </div>
      </div>
    ),
  },
  {
    order: 'Step 02',
    title: 'Immersive Reading',
    description:
      'Open any book in a dedicated, clutter-free reading view. Our smooth PDF engine ensures your focus stays on the text, not the tools.',
    icon: <Sparkles className="size-8 text-[#D97706]" />,
    visual: (
      <div className="w-48 bg-[#FDFBF7] dark:bg-[#1C1917] border border-[#e7e5e4] dark:border-[#292524] rounded shadow-sm p-4 flex flex-col gap-2 z-10 transition-transform group-hover:scale-105 duration-500">
        <div className="h-2 bg-[#e7e5e4] dark:bg-[#292524] rounded w-full" />
        <div className="h-2 bg-[#e7e5e4] dark:bg-[#292524] rounded w-5/6" />
        <div className="h-2 bg-[#e7e5e4] dark:bg-[#292524] rounded w-full" />
        <div className="h-2 bg-[#e7e5e4] dark:bg-[#292524] rounded w-4/6 mb-2" />
        <div className="flex items-center gap-2 text-[#D97706]">
          <Sparkles className="size-4 animate-pulse" />
          <div className="h-1.5 bg-[#D97706]/20 rounded w-16 overflow-hidden">
            <div className="h-full bg-[#D97706] w-full animate-pulse" />
          </div>
        </div>
      </div>
    ),
  },
  {
    order: 'Step 03',
    title: 'Think beside the Book',
    description:
      'Capture notes, save meaningful quotes, and create story insights directly beside the page you are reading. Every thought remains linked to its source.',
    icon: <Quote className="size-8 text-[#D97706]" />,
    visual: (
      <div className="w-48 bg-[#FFFDF5] dark:bg-[#292524] border-l-4 border-[#D97706] shadow-md p-4 relative z-10 transition-transform group-hover:scale-105 duration-500">
        <Quote className="size-6 text-[#D97706]/50 absolute top-2 right-2" />
        <p className="text-[10px] font-bold text-[#a8a29e] uppercase tracking-wider mb-2">
          Insight
        </p>
        <div className="space-y-2">
          <div className="h-2 bg-[#e7e5e4] dark:bg-[#44403c] rounded w-full" />
          <div className="h-2 bg-[#e7e5e4] dark:bg-[#44403c] rounded w-11/12" />
          <div className="h-2 bg-[#e7e5e4] dark:bg-[#44403c] rounded w-full" />
        </div>
      </div>
    ),
  },
  {
    order: 'Step 04',
    title: 'Never lose your context',
    description:
      'Reading progress, notes, and quotes are saved automatically. Return whenever you want and pick up exactly where you left off, with all your thinking preserved.',
    icon: <Bookmark className="size-8 text-[#a8a29e]" />,
    visual: (
      <div className="grid grid-cols-2 gap-3 w-48 z-10 transition-transform group-hover:scale-105 duration-500">
        <div className="aspect-square bg-[#FDFBF7] dark:bg-[#292524] rounded-lg flex items-center justify-center border border-[#e7e5e4] dark:border-[#44403c]">
          <History className="size-6 text-[#a8a29e]" />
        </div>
        <div className="aspect-square bg-[#1c1917] dark:bg-[#FDFBF7] rounded-lg flex items-center justify-center text-white dark:text-[#1c1917] shadow-lg transform -translate-y-2">
          <Bookmark className="size-6" />
        </div>
        <div className="aspect-square bg-[#FDFBF7] dark:bg-[#292524] rounded-lg flex items-center justify-center border border-[#e7e5e4] dark:border-[#44403c]">
          <FileText className="size-6 text-[#a8a29e]" />
        </div>
        <div className="aspect-square bg-[#FDFBF7] dark:bg-[#292524] rounded-lg flex items-center justify-center border border-[#e7e5e4] dark:border-[#44403c]">
          <Share2 className="size-6 text-[#a8a29e]" />
        </div>
      </div>
    ),
  },
];

const Steps = () => {
  const transition = { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any };

  return (
    <section className="bg-[#FDFBF7] dark:bg-[#1C1917] py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Central Line */}
        <div className="hidden md:block absolute left-1/2 top-10 bottom-10 w-px bg-[#e7e5e4] dark:bg-[#292524] -translate-x-1/2" />

        <div className="space-y-20 md:space-y-32">
          {steps.map((step, index) => {
            const isEven = index % 2 === 1;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={transition}
                className="relative flex flex-col md:flex-row items-center gap-10 md:gap-20"
              >
                {/* Text Content */}
                <div
                  className={`w-full md:w-1/2 flex flex-col ${isEven ? 'md:order-2 md:items-start text-center md:text-left' : 'md:order-1 md:items-end text-center md:text-right'}`}
                >
                  <span className="inline-block bg-[#D97706]/10 text-[#D97706] font-black tracking-[0.3em] uppercase px-3 py-1 rounded-full text-[10px] mb-4">
                    {step.order}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-serif text-[#1c1917] dark:text-[#fafaf9] mb-4">
                    {step.title}
                  </h2>
                  <p className="text-[#78716c] dark:text-[#a8a29e] leading-relaxed max-w-sm md:max-w-md">
                    {step.description}
                  </p>
                </div>

                {/* Vertical Timeline Dot */}
                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#e7e5e4] dark:bg-[#44403c] border-4 border-[#FDFBF7] dark:border-[#1C1917] z-10" />

                {/* Decorative Visual Card */}
                <div
                  className={`w-full md:w-1/2 flex justify-center ${isEven ? 'md:order-1' : 'md:order-2'}`}
                >
                  <div className="group w-full max-w-sm bg-white dark:bg-[#292524] border border-[#e7e5e4] dark:border-[#44403c] rounded-2xl p-8 aspect-4/3 flex items-center justify-center relative overflow-hidden transition-all hover:bg-[#fafaf9] dark:hover:bg-[#2c2826] hover:shadow-xl hover:shadow-[#000000]/5 cursor-default">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#44403c_1px,transparent_1px)] bg-size-[16px_16px] opacity-20" />

                    {/* Floating Decorative Circles */}
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#e7e5e4]/20 dark:bg-[#44403c]/20 rounded-full blur-2xl" />

                    {step.visual}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Steps;
