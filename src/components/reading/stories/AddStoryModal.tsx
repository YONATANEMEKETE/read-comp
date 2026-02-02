'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { storySchema, StoryInput } from '@/types/validation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

interface AddStoryModalProps {
  onClose: () => void;
  onSave?: (content: string) => void;
}

const AddStoryModal = ({ onClose, onSave }: AddStoryModalProps) => {
  const form = useForm<StoryInput>({
    resolver: zodResolver(storySchema),
    defaultValues: {
      content: '',
    },
  });

  const onSubmit = (data: StoryInput) => {
    if (onSave) {
      onSave(data.content.trim());
    }
    onClose();
  };

  return (
    <div className="absolute bottom-[84px] left-6 right-6 z-40 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-[#f5f1e8] dark:bg-[#1c1a17] rounded-xl shadow-floating border border-sepia-divider dark:border-stone-700 p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-primary">
            New Story Entry
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="w-full h-32 bg-white dark:bg-[#25222e] border-sepia-divider/80 dark:border-stone-700 rounded-lg p-3 text-stone-800 dark:text-stone-200 placeholder-stone-400 focus-visible:ring-primary/20 font-serif text-sm leading-relaxed resize-none shadow-inner-soft transition-all"
                      placeholder="Write your takeaway..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-[#8b7662] text-white font-medium text-sm h-10 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              Save Story
            </Button>
          </form>
        </Form>

        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#f5f1e8] dark:bg-[#1c1a17] border-b border-r border-sepia-divider dark:border-stone-700 transform rotate-45"></div>
      </div>
    </div>
  );
};

export default AddStoryModal;
