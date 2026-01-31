'use client';

import React, { useState } from 'react';
import { X, Image as ImageIcon, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface AddStoryModalProps {
  onClose: () => void;
  onSave?: (content: string) => void;
}

const AddStoryModal = ({ onClose, onSave }: AddStoryModalProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSave = () => {
    if (!content.trim()) return;

    // If title exists, combine them or just use content
    const finalContent = title.trim()
      ? `${title.trim()}\n\n${content.trim()}`
      : content.trim();

    if (onSave) {
      onSave(finalContent);
    }
    onClose();
  };

  return (
    <div className="absolute bottom-[84px] left-6 right-6 z-40 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white dark:bg-[#25221e] rounded-xl shadow-floating border border-sepia-divider/50 dark:border-stone-700/50 p-4 relative">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold text-stone-800 dark:text-stone-200">
            New Story
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
          >
            <X className="w-[18px] h-[18px]" />
          </Button>
        </div>

        <div className="mb-3">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-stone-50 dark:bg-stone-900 border-none rounded-lg px-3 py-2 text-sm font-medium text-stone-800 dark:text-stone-200 placeholder-stone-400 focus-visible:ring-1 focus-visible:ring-primary/50 shadow-none"
            placeholder="Story Title (Optional)"
          />
        </div>

        <div className="relative">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-32 bg-stone-50 dark:bg-stone-900 border-none rounded-lg px-3 py-2 text-sm font-serif text-stone-800 dark:text-stone-200 placeholder-stone-400 resize-none focus-visible:ring-1 focus-visible:ring-primary/50 shadow-none"
            placeholder="Write your takeaway..."
          />
        </div>

        <div className="flex items-center justify-between mt-3">
          <Button
            onClick={handleSave}
            className="bg-primary hover:bg-[#8b7562] text-white px-4 py-1.5 h-8 rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            Save Story
          </Button>
        </div>

        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-[#25221e] border-b border-r border-sepia-divider/50 dark:border-stone-700/50 transform rotate-45"></div>
      </div>
    </div>
  );
};

export default AddStoryModal;
