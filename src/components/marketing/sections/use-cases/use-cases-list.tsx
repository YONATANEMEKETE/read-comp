'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  GraduationCap,
  Brain,
  Presentation,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Users,
  Target,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const useCases = [
  {
    title: 'Academic Excellence',
    description:
      'Transform complex textbooks and academic papers into structured knowledge. Noted lets you capture citations and margin notes without losing the thread of your research.',
    icon: <GraduationCap className="size-8 text-[#D97706]" />,
    benefits: [
      'Context-linked citations',
      'Searchable course library',
      'Chapter-by-chapter summaries',
    ],
    cta: 'Elevate your research',
    image: '/images/use-case-1.png',
    bg: 'bg-[#F5F5F0] dark:bg-[#2A2826]',
    border: 'border-y border-stone-200 dark:border-stone-800',
  },
  {
    title: 'Lifelong Growth',
    description:
      'Read non-fiction with purpose. Build a personal knowledge base where every quote and story insight remains attached to the exact page it was born, ready for your next big idea.',
    icon: <Brain className="size-8 text-amber-600 dark:text-amber-500" />,
    benefits: [
      'Structured story insights',
      'Linked quote collections',
      'Deep-focus reading mode',
    ],
    cta: 'Start your collection',
    image: '/images/use-case-2.png',
    bg: 'bg-[#FDFBF7] dark:bg-[#1C1917]',
    border: '',
  },
  {
    title: 'Strategic Insight',
    description:
      'Stay ahead in your field by processing industry analysis and whitepapers more effectively. Turn dense information into actionable takeaways for your next project or meeting.',
    icon: <Briefcase className="size-8 text-orange-700 dark:text-orange-400" />,
    benefits: [
      'Project-based book collections',
      'Rapid insight synthesis',
      'Secure, private knowledge library',
    ],
    cta: 'Optimize your insights',
    image: '/images/use-case-3.png',
    bg: 'bg-[#EFEBE9] dark:bg-[#322F2D]',
    border: 'border-y border-stone-200 dark:border-stone-800',
  },
  {
    title: 'Content Creation',
    description:
      'Design syllabi, lecture notes, or articles with precision. Draft insights directly alongside your primary sources, ensuring every reference is accurate and accessible.',
    icon: (
      <Presentation className="size-8 text-orange-700 dark:text-orange-400" />
    ),
    benefits: [
      'Structured lecture preparation',
      'Direct-to-source annotation',
      'Organized reference database',
    ],
    cta: 'Prepare with precision',
    image: '/images/use-case-4.png',
    bg: 'bg-[#FDFBF7] dark:bg-[#1C1917]',
    border: '',
  },
];

const UseCasesList = () => {
  const transition = { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any };

  return (
    <div>
      {useCases.map((useCase, index) => {
        const isEven = index % 2 === 0;
        return (
          <section
            key={index}
            className={`py-24 md:py-32 ${useCase.bg} ${useCase.border}`}
          >
            <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center gap-16 md:gap-24">
              <motion.div
                initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={transition}
                className={`flex-1 ${isEven ? 'md:order-1' : 'md:order-2'}`}
              >
                <div className="w-16 h-16 bg-white dark:bg-stone-800 rounded-2xl flex items-center justify-center mb-8 shadow-sm border border-stone-100 dark:border-stone-700">
                  {useCase.icon}
                </div>
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6 text-[#1c1917] dark:text-stone-100">
                  {useCase.title}
                </h2>
                <p className="text-xl text-[#78716c] dark:text-[#a8a29e] font-light leading-relaxed mb-8">
                  {useCase.description}
                </p>
                <ul className="space-y-4 mb-10">
                  {useCase.benefits.map((benefit, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-stone-700 dark:text-stone-300 font-medium font-serif italic text-lg"
                    >
                      <CheckCircle2 className="size-5 text-[#D97706] mt-1 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-[#D97706] font-black uppercase tracking-[0.2em] text-[10px] hover:text-[#1c1917] dark:hover:text-white transition-colors group"
                >
                  {useCase.cta}
                  <ArrowRight className="size-4 transform transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={transition}
                className={`flex-1 ${isEven ? 'md:order-2' : 'md:order-1'} w-full group`}
              >
                <div className="relative aspect-4/3 bg-stone-200 dark:bg-stone-800/50 rounded-3xl overflow-hidden flex items-center justify-center border border-stone-300/50 dark:border-stone-700/50 shadow-2xl">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#44403c_1px,transparent_1px)] bg-[size:24px_24px] opacity-30" />

                  <div className="relative w-full h-full p-6 md:p-10 transition-transform duration-700 group-hover:scale-105">
                    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                      <Image
                        src={useCase.image}
                        alt={useCase.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  </div>

                  {/* Glassmorphic card overlay for premium feel */}
                  <div className="absolute bottom-6 right-6 p-4 bg-white/40 dark:bg-black/40 backdrop-blur-md rounded-xl border border-white/20 dark:border-white/10 hidden md:block z-10">
                    <div className="h-2 w-32 bg-white/60 dark:bg-white/20 rounded-full mb-2" />
                    <div className="h-2 w-24 bg-white/40 dark:bg-white/10 rounded-full" />
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default UseCasesList;
