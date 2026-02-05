'use client';

import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import StoryCard from './stories/StoryCard';
import AddStoryModal from './stories/AddStoryModal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useStories } from '@/hooks/use-stories';

interface StoryContentProps {
  bookId?: string;
  isOffline?: boolean;
}

const StoryContent = ({ bookId, isOffline = false }: StoryContentProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { stories, isLoading, saveStory, deleteStory } = useStories(bookId);

  const handleSaveStory = async (content: string) => {
    if (isOffline) return;
    await saveStory(content);
  };

  const handleDeleteStory = (id: string) => {
    if (isOffline) return;
    deleteStory(id);
  };

  const filteredStories = stories.filter((story) =>
    story.content.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col h-full relative">
      {isOffline && (
        <div className="px-6 py-2 text-xs text-amber-700 bg-amber-50 border-b border-amber-200">
          Offline mode: adding and deleting stories is disabled.
        </div>
      )}
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
      <div className="flex-1 overflow-y-auto bg-warm-bg dark:bg-sidebar-dark relative p-6 space-y-4 pb-24">
        {isModalOpen && (
          <div className="absolute inset-0 bg-warm-bg/70 dark:bg-sidebar-dark/80 backdrop-blur-[2px] z-20 animate-in fade-in duration-300"></div>
        )}
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
          <div className=" space-y-4">
            {filteredStories.map((story) => (
              <StoryCard
                key={story.id}
                id={story.id}
                content={story.content}
                createdAt={story.createdAt}
                onDelete={handleDeleteStory}
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

      {/* Add Button */}
      <div className="absolute bottom-6 left-0 right-0 px-8 flex justify-center pointer-events-none z-30">
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white font-medium text-sm h-12 w-full rounded-full shadow-lg hover:shadow-xl hover:bg-[#8b7662] transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 pointer-events-auto cursor-pointer active:scale-95"
          disabled={!bookId || isOffline}
        >
          <Plus className="w-5 h-5" />
          Add Story
        </Button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-warm-bg via-warm-bg/80 to-transparent dark:from-sidebar-dark dark:via-sidebar-dark/80 pointer-events-none z-10"></div>
    </div>
  );
};

export default StoryContent;
