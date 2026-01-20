'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const faqs = [
  {
    question: 'How does Noted sync with my library?',
    answer:
      "Noted connects directly to your local file system or cloud storage providers like Dropbox and Google Drive. Once you import a book (PDF or EPUB), we create a secure local index. Your reading progress and notes are synced across devices whenever you're online, but the files themselves stay where you put them.",
  },
  {
    question: 'Is my reading data private?',
    answer:
      'Absolutely. We believe your thoughts are your own. Noted uses end-to-end encryption for your notes and highlights. We do not scan your books, sell your reading habits, or use your content to train AI models without your explicit, opt-in permission.',
  },
  {
    question: 'Can I export my notes?',
    answer:
      'Yes. Data portability is a core value of Noted. You can export your highlights and margin notes at any time in multiple formats, including Markdown (for Obsidian/Notion), Plain Text, PDF, and CSV. You are never locked in.',
  },
  {
    question: 'Does it work offline?',
    answer:
      "Noted is a Progressive Web App (PWA). Once you've loaded a book, it is cached locally on your device. You can read, highlight, and write notes completely offline. Changes will sync to the cloud the next time you connect to the internet.",
  },
  {
    question: 'Is there a student discount?',
    answer:
      'We offer a 50% discount for students and educators with a valid .edu email address. Simply sign up for the free trial and email our support team with your proof of enrollment to have the discount applied to your account.',
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
          className={`flex-shrink-0 mt-1 md:mt-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#D97706]' : 'text-[#a8a29e] group-hover:text-[#D97706]'}`}
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
            className="font-sans text-4xl md:text-5xl lg:text-7xl font-bold text-[#1c1917] dark:text-[#fafaf9] mb-6 tracking-tight"
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
