'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Quote } from '@prisma/client';
import { toast } from 'sonner';
import { deleteQuoteAction, getQuotesAction, saveQuoteAction } from '@/actions/quotes';

export const useQuotes = (bookId?: string) => {
  const queryClient = useQueryClient();

  const { data: quotes = [], isLoading } = useQuery({
    queryKey: ['quotes', bookId],
    queryFn: async () => {
      if (!bookId) return [];
      const result = await getQuotesAction(bookId);
      if (result.success && result.data) {
        return result.data as Quote[];
      }
      return [];
    },
    enabled: !!bookId,
    staleTime: Infinity,
  });

  const saveMutation = useMutation({
    mutationFn: async ({ text, author }: { text: string; author: string }) => {
      if (!bookId) throw new Error('No book ID');
      const result = await saveQuoteAction(bookId, text, author);
      if (!result.success) throw new Error(result.message);
      return result.data as Quote;
    },
    onMutate: async ({ text, author }) => {
      await queryClient.cancelQueries({ queryKey: ['quotes', bookId] });
      const previousQuotes = queryClient.getQueryData<Quote[]>(['quotes', bookId]);

      const tempId = `temp-${Date.now()}`;
      const optimisticQuote: Quote = {
        id: tempId,
        text,
        citedPerson: author || null,
        userId: 'temp-user',
        bookId: bookId!,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      queryClient.setQueryData<Quote[]>(['quotes', bookId], (old) => [
        optimisticQuote,
        ...(old || []),
      ]);

      return { previousQuotes, tempId };
    },
    onError: (err, variables, context) => {
      if (context?.previousQuotes) {
        queryClient.setQueryData(['quotes', bookId], context.previousQuotes);
      }
      toast.error(err.message);
    },
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData<Quote[]>(['quotes', bookId], (old) =>
        old?.map((q) => (q.id === context.tempId ? data : q)),
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes', bookId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (quoteId: string) => {
      const result = await deleteQuoteAction(quoteId);
      if (!result.success) throw new Error(result.message);
      return quoteId;
    },
    onMutate: async (quoteId) => {
      await queryClient.cancelQueries({ queryKey: ['quotes', bookId] });
      const previousQuotes = queryClient.getQueryData<Quote[]>(['quotes', bookId]);

      queryClient.setQueryData<Quote[]>(['quotes', bookId], (old) =>
        old ? old.filter((q) => q.id !== quoteId) : [],
      );

      return { previousQuotes };
    },
    onError: (err, variables, context) => {
      if (context?.previousQuotes) {
        queryClient.setQueryData(['quotes', bookId], context.previousQuotes);
      }
      toast.error('Failed to delete quote');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes', bookId] });
    },
  });

  return {
    quotes,
    isLoading,
    isSaving: saveMutation.isPending,
    isDeleting: deleteMutation.isPending,
    saveQuote: async (text: string, author = '') => {
      return saveMutation.mutateAsync({ text, author });
    },
    deleteQuote: (id: string) => deleteMutation.mutate(id),
  };
};
