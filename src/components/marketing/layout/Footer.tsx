'use client';

import React from 'react';
import { Linkedin, Github, Mail } from 'lucide-react';
import { motion } from 'motion/react';

const Footer = () => {
  const transition = { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any };

  return (
    <footer className="bg-[#f5f5f4] dark:bg-[#0c0a09] py-16 border-t border-[#e7e5e4] dark:border-[#292524]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={transition}
        className="max-w-7xl mx-auto px-6 lg:px-12"
      >
        <div className="flex flex-col md:flex-row justify-between items-center md:items-center gap-8 text-center md:text-left">
          <div>
            <span className="text-2xl font-black tracking-tighter uppercase mb-4 block text-[#1c1917] dark:text-[#fafaf9]">
              Noted.
            </span>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#78716c] mb-2">
              A quiet space for thoughtful reading.
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#a8a29e]">
              © 2024 Noted Built for readers who like to think while they read.
            </p>
          </div>
          <div className="flex items-center gap-8 mt-4 md:mt-0">
            <a
              href="#"
              aria-label="LinkedIn"
              className="text-[#a8a29e] hover:text-[#78716c] dark:hover:text-[#d6d3d1] transition-colors duration-300"
            >
              <Linkedin className="size-6" />
            </a>
            <a
              href="#"
              aria-label="GitHub"
              className="text-[#a8a29e] hover:text-[#78716c] dark:hover:text-[#d6d3d1] transition-colors duration-300"
            >
              <Github className="size-6" />
            </a>
            <a
              href="mailto:hello@noted.com"
              aria-label="Email"
              className="text-[#a8a29e] hover:text-[#78716c] dark:hover:text-[#d6d3d1] transition-colors duration-300"
            >
              <Mail className="size-6" />
            </a>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
