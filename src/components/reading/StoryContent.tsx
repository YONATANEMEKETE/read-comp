'use client';

import React, { useState } from 'react';
import { Search, PlusCircle } from 'lucide-react';
import StoryCard from './stories/StoryCard';
import AddStoryModal from './stories/AddStoryModal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getStoriesAction, saveStoryAction } from '@/actions/stories';
import { toast } from 'sonner';
import { Story } from '@prisma/client';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface StoryContentProps {
  bookId?: string;
}

const StoryContent = ({ bookId }: StoryContentProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();

  const { data: stories = [], isLoading } = useQuery({
    queryKey: ["stories", bookId],
    queryFn: async () => {
      if (!bookId) return [];
      const result = await getStoriesAction(bookId);
      if (result.success && result.data) {
        return result.data as Story[];
      }
      return [];
    },
    enabled: !!bookId,
    staleTime: Infinity,
  });

  const saveMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!bookId) throw new Error("No book ID");
      const result = await saveStoryAction(bookId, content);
      if (!result.success) throw new Error(result.message);
      return result.data as Story;
    },
    onMutate: async (content) => {
      await queryClient.cancelQueries({ queryKey: ["stories", bookId] });
      const previousStories = queryClient.getQueryData<Story[]>(["stories", bookId]);

      const tempId = `temp-${Date.now()}`;
      const optimisticStory: Story = {
        id: tempId,
        content,
        userId: 'temp-user',
        bookId: bookId!,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      queryClient.setQueryData<Story[]>(["stories", bookId], (old) => [optimisticStory, ...(old || [])]);

      return { previousStories, tempId };
    },
    onError: (err, variables, context) => {
      if (context?.previousStories) {
        queryClient.setQueryData(["stories", bookId], context.previousStories);
      }
      toast.error(err.message);
    },
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData<Story[]>(["stories", bookId], (old) => 
        old?.map((s) => s.id === context.tempId ? data : s)
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["stories", bookId] });
    },
  });

  const handleSaveStory = async (content: string) => {
    saveMutation.mutate(content);
  };

  const filteredStories = stories.filter((story) =>
    story.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full relative">
      {/* Search Header */}
      <div className="px-6 py-4 border-b border-sepia-divider/30 dark:border-stone-800/50 bg-stone-50/30 dark:bg-stone-900/20 shrink-0">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-[18px] h-[18px] group-focus-within:text-primary transition-colors" />
          <Input
            className="w-full bg-white dark:bg-[#16181d] border-stone-200 dark:border-stone-800 rounded-lg py-2 pl-9 pr-4 text-sm placeholder-stone-400 text-stone-700 dark:text-stone-300 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-sm transition-all outline-none h-10"
            placeholder="Search stories..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto bg-warm-bg dark:bg-sidebar-dark relative pb-24">
        {isLoading && stories.length === 0 ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredStories.length === 0 ? (
          <div className="text-center text-stone-400 mt-10 p-6">
            {searchQuery
              ? 'No stories found matching your search.'
              : 'No stories yet. Share your takeaway!'}
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {filteredStories.map((story) => (
              <StoryCard
                key={story.id}
                content={story.content}
                createdAt={story.createdAt}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AddStoryModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveStory}
        />
      )}

      {/* Add Button Area */}
      <div className="absolute bottom-6 left-0 right-0 px-8 pointer-events-none flex justify-center z-20">
        <Button
          onClick={() => setIsModalOpen(true)}
          className="pointer-events-auto shadow-floating bg-primary hover:bg-[#8b735f] text-white px-6 py-6 rounded-full flex items-center gap-2.5 transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-95 font-medium text-sm w-full justify-center cursor-pointer ring-4 ring-white dark:ring-sidebar-dark"
          disabled={!bookId}
        >
          <PlusCircle className="w-5 h-5" />
          Add Story
        </Button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-warm-bg via-warm-bg/80 to-transparent dark:from-sidebar-dark dark:via-sidebar-dark/80 pointer-events-none z-10"></div>
    </div>
  );
};

export default StoryContent;