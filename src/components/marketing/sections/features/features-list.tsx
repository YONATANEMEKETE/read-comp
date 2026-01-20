'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Library, Sparkles, CircleHelp, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    title: 'A Unified Knowledge Base',
    description:
      "Your journey begins by centralizing your intellectual diet. Noted gathers your textbooks, research papers, and industrial whitepapers into a focused library. It's more than storage; it's a searchable sanctuary for your lifelong learning.",
    icon: <Library className="size-8 text-[#1c1917] dark:text-[#fafaf9]" />,
    cta: 'Curate your space',
    href: '/login',
  },
  {
    title: 'Marginal Thinking',
    description:
      "Experience the power of 'thinking beside the book.' Our interface preserves the relationship between your highlights and your notes. Capture every thought directly in the margin, ensuring your insights always retain their original context.",
    icon: <Sparkles className="size-8 text-[#1c1917] dark:text-[#fafaf9]" />,
    cta: 'Master the margins',
    href: '/login',
  },
  {
    title: 'Crystallized Story Insights',
    description:
      "As you read, our system identifies the narrative threads within complex non-fiction. We transform dense chapters into elegant 'Story Insights'—automated summaries that help you synthesize the author's core arguments without losing the nuance.",
    icon: <Zap className="size-8 text-[#1c1917] dark:text-[#fafaf9]" />,
    cta: 'Observe the synthesis',
    href: '/login',
  },
  {
    title: 'The Dialogue of Understanding',
    description:
      "True comprehension is an active conversation. When a concept feels dense, Noted generates probing questions to test your grasp. It's an interactive dialogue designed to shift your reading from passive consumption to deep mastery.",
    icon: <CircleHelp className="size-8 text-[#1c1917] dark:text-[#fafaf9]" />,
    cta: 'Begin the dialogue',
    href: '/login',
  },
];

const FeaturesList = () => {
  const transition = { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any };

  return (
    <section className="bg-[#FDFBF7] dark:bg-[#1C1917] py-20 px-6 lg:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
        {/* Vertical Timeline Line */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-[#e7e5e4] dark:bg-[#292524] transform md:-translate-x-1/2 z-0" />

        <div className="space-y-16 md:space-y-40 relative z-10">
          {features.map((feature, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={index}
                className="relative flex flex-col md:flex-row items-center md:items-start pl-12 md:pl-0"
              >
                {/* Timeline Dot */}
                <div className="absolute left-6 md:left-1/2 top-8 md:top-12 size-3 bg-[#D97706] rounded-full border-4 border-[#FDFBF7] dark:border-[#1C1917] transform -translate-x-1/2 z-20 shadow-sm" />

                {/* Content Side */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={transition}
                  className={`w-full md:w-1/2 ${isEven ? 'md:pr-24 md:text-right md:items-end' : 'md:pl-24 md:order-2 md:items-start'} flex flex-col items-start`}
                >
                  <div className="mb-6 p-4 rounded-3xl bg-[#f5f5f4] dark:bg-[#292524] transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-[#1c1917] dark:text-[#fafaf9] mb-6 font-sans">
                    {feature.title}
                  </h3>
                  <p className="text-[#57534e] dark:text-[#a8a29e] leading-relaxed text-lg font-sans mb-8">
                    {feature.description}
                  </p>
                  <div>
                    <Link
                      href={feature.href}
                      className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#D97706] hover:text-[#1c1917] dark:hover:text-white transition-colors group"
                    >
                      {feature.cta}
                      <ArrowRight className="size-3 transform transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </motion.div>

                {/* Empty Side (For Desktop Alternating) */}
                <div
                  className={`hidden md:block md:w-1/2 ${isEven ? 'md:order-2' : 'md:order-1'}`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesList;
