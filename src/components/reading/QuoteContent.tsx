'use client';

import React, { useState } from "react";
import { Search, Plus } from "lucide-react";
import QuoteCard from "./quotes/QuoteCard";
import AddQuoteModal from "./quotes/AddQuoteModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getQuotesAction, saveQuoteAction } from "@/actions/quotes";
import { toast } from "sonner";
import { Quote } from "@prisma/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface QuoteContentProps {
  bookId?: string;
}

const QuoteContent = ({ bookId }: QuoteContentProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  const { data: quotes = [], isLoading } = useQuery({
    queryKey: ["quotes", bookId],
    queryFn: async () => {
      if (!bookId) return [];
      const result = await getQuotesAction(bookId);
      if (result.success && result.data) {
        return result.data as Quote[];
      }
      return [];
    },
    enabled: !!bookId,
    staleTime: Infinity, // Keep data fresh until manually invalidated
  });

  const saveMutation = useMutation({
    mutationFn: async ({ text, author }: { text: string; author: string }) => {
      if (!bookId) throw new Error("No book ID");
      const result = await saveQuoteAction(bookId, text, author);
      if (!result.success) throw new Error(result.message);
      return result.data as Quote;
    },
    onMutate: async ({ text, author }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["quotes", bookId] });

      // Snapshot the previous value
      const previousQuotes = queryClient.getQueryData<Quote[]>(["quotes", bookId]);

      // Optimistically update to the new value
      const tempId = `temp-${Date.now()}`;
      const optimisticQuote: Quote = {
        id: tempId,
        text,
        citedPerson: author || null,
        userId: "temp-user",
        bookId: bookId!,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      };

      queryClient.setQueryData<Quote[]>(["quotes", bookId], (old) => [optimisticQuote, ...(old || [])]);

      return { previousQuotes, tempId };
    },
    onError: (err, variables, context) => {
      // Revert to the previous value on error
      if (context?.previousQuotes) {
        queryClient.setQueryData(["quotes", bookId], context.previousQuotes);
      }
      toast.error(err.message);
    },
    onSuccess: (data, variables, context) => {
      // Replace optimistic quote with the real one
      queryClient.setQueryData<Quote[]>(["quotes", bookId], (old) => 
        old?.map((q) => q.id === context.tempId ? data : q)
      );
    },
    onSettled: () => {
      // Always refetch in the background to ensure we're in sync
      queryClient.invalidateQueries({ queryKey: ["quotes", bookId] });
    },
  });

  const handleSaveQuote = async (text: string, author: string) => {
    saveMutation.mutate({ text, author });
  };

  const filteredQuotes = quotes.filter((quote) =>
    quote.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (quote.citedPerson && quote.citedPerson.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full relative">
      {/* Search Header */}
      <div className="px-6 py-4 border-b border-sepia-divider/30 dark:border-stone-800/50 bg-stone-50/30 dark:bg-stone-900/20 shrink-0">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-[18px] h-[18px] group-focus-within:text-primary transition-colors z-10" />
          <Input
            className="w-full bg-white dark:bg-[#16181d] border-stone-200 dark:border-stone-800 rounded-lg py-2 pl-9 pr-4 text-sm placeholder-stone-400 text-stone-700 dark:text-stone-300 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-sm transition-all outline-none h-10"
            placeholder="Search saved quotes..."
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
        
        {isLoading && quotes.length === 0 ? (
           <div className="flex justify-center items-center py-10">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
           </div>
        ) : filteredQuotes.length === 0 ? (
          <div className="text-center text-stone-400 mt-10">
            {searchQuery ? "No quotes found matching your search." : "No quotes yet. Add one to get started!"}
          </div>
        ) : (
          filteredQuotes.map((quote) => (
            <QuoteCard key={quote.id} text={quote.text} author={quote.citedPerson || "Unknown"} />
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AddQuoteModal onClose={() => setIsModalOpen(false)} onSave={handleSaveQuote} />
      )}

      {/* Add Button */}
      <div className="absolute bottom-6 left-0 right-0 px-8 flex justify-center pointer-events-none z-30">
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white font-medium text-sm h-12 w-full rounded-full shadow-lg hover:shadow-xl hover:bg-[#8b7662] transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 pointer-events-auto cursor-pointer"
          disabled={!bookId}
        >
          <Plus className="w-5 h-5" />
          Add Quote
        </Button>
      </div>
    </div>
  );
};

export default QuoteContent;
