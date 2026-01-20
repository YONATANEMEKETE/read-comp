'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const faqs = [
  {
    question: 'What makes Noted different from a standard PDF reader?',
    answer:
      'Most readers treat notes as a separate layer or file. Noted bridges the gap by keeping your thinking directly beside the book. By preserving the original context of every insight, we make your knowledge easier to revisit, recall, and synthesize.',
  },
  {
    question: 'How do Story Insights work?',
    answer:
      "Our system identifies key narrative threads and complex arguments within your non-fiction books. It automatically generates 'Story Insights'—structured summaries that help you grasp the essential points of a chapter while keeping all your highlights linked to the original text.",
  },
  {
    question: 'Is my reading data private?',
    answer:
      'Absolutely. We believe your thoughts are your own. Noted uses end-to-end encryption for your notes and highlights. We do not scan your private library for advertising, and we never use your notes to train AI models without your explicit, opt-in permission.',
  },
  {
    question: 'Can I export my notes for other tools?',
    answer:
      'Yes. Data portability is central to Noted. You can export your highlights, margin notes, and story insights in Markdown (perfect for Obsidian or Notion), Plain Text, or PDF. Your thinking is never locked in.',
  },
  {
    question: 'Does it work offline?',
    answer:
      "Yes. Once a book is added to your library, it is cached locally. You can read, highlight, and capture notes without an internet connection. Your changes will sync automatically the next time you're online.",
  },
];

const FaqItem = ({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <div className="border-b border-[#e7e5e4] dark:border-[#292524]">
      <button
        onClick={onClick}
        className="w-full text-left py-8 flex justify-between items-start md:items-center focus:outline-none group"
      >
        <span
          className={`font-serif text-xl md:text-2xl font-bold transition-colors pr-8 ${isOpen ? 'text-[#D97706]' : 'text-[#1c1917] dark:text-[#fafaf9] group-hover:text-[#D97706]'}`}
        >
          {question}
        </span>
        <div
          className={`shrink-0 mt-1 md:mt-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#D97706]' : 'text-[#a8a29e] group-hover:text-[#D97706]'}`}
        >
          {isOpen ? <Minus className="size-6" /> : <Plus className="size-6" />}
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-8 pr-4 md:pr-12">
              <p className="font-sans font-light text-[#78716c] dark:text-[#a8a29e] text-lg leading-relaxed">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Faq = () => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const transition = { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any };

  return (
    <section className="bg-[#FDFBF7] dark:bg-[#1C1917] pt-32 pb-20 px-6 lg:px-12 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition}
            className="text-5xl md:text-7xl font-black tracking-tighter text-[#1c1917] dark:text-[#fafaf9] mb-8 uppercase leading-[0.9] text-center"
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: 0.1 }}
            className="text-lg md:text-xl font-light text-[#78716c] dark:text-[#a8a29e] max-w-xl mx-auto leading-relaxed"
          >
            Everything you need to know about using Noted to read, think, and
            remember better.
          </motion.p>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: 0.2 }}
          className="space-y-4"
        >
          {faqs.map((faq, index) => (
            <FaqItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: 0.3 }}
          className="mt-20 text-center"
        >
          <p className="text-[#a8a29e] font-medium mb-6">
            Still have questions?
          </p>
          <Button
            asChild
            className="bg-[#1c1917] dark:bg-[#fafaf9] text-[#fafaf9] dark:text-[#1c1917] px-8 py-6 font-bold uppercase tracking-widest text-xs hover:bg-[#D97706] dark:hover:bg-[#D97706] dark:hover:text-white transition-all rounded-none h-auto"
          >
            <a href="mailto:hello@noted.com">Contact Support</a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Faq;
