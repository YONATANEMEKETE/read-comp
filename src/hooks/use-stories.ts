'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Story } from '@prisma/client';
import { toast } from 'sonner';
import { deleteStoryAction, getStoriesAction, saveStoryAction } from '@/actions/stories';

export const useStories = (bookId?: string) => {
  const queryClient = useQueryClient();

  const { data: stories = [], isLoading } = useQuery({
    queryKey: ['stories', bookId],
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
      if (!bookId) throw new Error('No book ID');
      const result = await saveStoryAction(bookId, content);
      if (!result.success) throw new Error(result.message);
      return result.data as Story;
    },
    onMutate: async (content) => {
      await queryClient.cancelQueries({ queryKey: ['stories', bookId] });
      const previousStories = queryClient.getQueryData<Story[]>(['stories', bookId]);

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

      queryClient.setQueryData<Story[]>(['stories', bookId], (old) => [
        optimisticStory,
        ...(old || []),
      ]);

      return { previousStories, tempId };
    },
    onError: (err, variables, context) => {
      if (context?.previousStories) {
        queryClient.setQueryData(['stories', bookId], context.previousStories);
      }
      toast.error(err.message);
    },
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData<Story[]>(['stories', bookId], (old) =>
        old?.map((s) => (s.id === context.tempId ? data : s)),
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['stories', bookId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (storyId: string) => {
      const result = await deleteStoryAction(storyId);
      if (!result.success) throw new Error(result.message);
      return storyId;
    },
    onMutate: async (storyId) => {
      await queryClient.cancelQueries({ queryKey: ['stories', bookId] });
      const previousStories = queryClient.getQueryData<Story[]>(['stories', bookId]);

      queryClient.setQueryData<Story[]>(['stories', bookId], (old) =>
        old ? old.filter((s) => s.id !== storyId) : [],
      );

      return { previousStories };
    },
    onError: (err, variables, context) => {
      if (context?.previousStories) {
        queryClient.setQueryData(['stories', bookId], context.previousStories);
      }
      toast.error('Failed to delete story');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['stories', bookId] });
    },
  });

  return {
    stories,
    isLoading,
    isSaving: saveMutation.isPending,
    isDeleting: deleteMutation.isPending,
    saveStory: async (content: string) => {
      return saveMutation.mutateAsync(content);
    },
    deleteStory: (id: string) => deleteMutation.mutate(id),
  };
};
