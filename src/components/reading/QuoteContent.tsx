import React, { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import QuoteCard from "./quotes/QuoteCard";
import AddQuoteModal from "./quotes/AddQuoteModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getQuotesAction, saveQuoteAction } from "@/actions/quotes";
import { toast } from "sonner";
import { Quote } from "@prisma/client";

interface QuoteContentProps {
  bookId?: string;
}

const QuoteContent = ({ bookId }: QuoteContentProps) => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchQuotes = async () => {
      if (!bookId) return;
      
      setIsLoading(true);
      const result = await getQuotesAction(bookId);
      if (result.success && result.data) {
        setQuotes(result.data as Quote[]);
      } else {
        toast.error(result.message);
      }
      setIsLoading(false);
    };

    fetchQuotes();
  }, [bookId]);

  const handleSaveQuote = async (text: string, author: string) => {
    if (!text.trim() || !bookId) return;
    
    const tempId = `temp-${Date.now()}`;
    const optimisticQuote: Quote = {
      id: tempId,
      text,
      citedPerson: author || null,
      userId: "temp-user",
      bookId: bookId,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    };

    // Add optimistic quote to state
    setQuotes((prev) => [optimisticQuote, ...prev]);

    const result = await saveQuoteAction(bookId, text, author);
    
    if (result.success && result.data) {
      // Replace optimistic quote with the real one from server
      const realQuote = result.data as Quote;
      setQuotes((prev) => prev.map((q) => q.id === tempId ? realQuote : q));
    } else {
      // Remove optimistic quote on failure
      setQuotes((prev) => prev.filter((q) => q.id !== tempId));
    }
  };

  const filteredQuotes = quotes.filter((quote) =>
    quote.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (quote.citedPerson && quote.citedPerson.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full relative">
      {/* Search Header */}
      <div className="px-6 py-4 bg-white dark:bg-sidebar-dark border-b border-sepia-divider/30 dark:border-stone-800/50 shrink-0">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400 z-10">
            <Search className="w-[18px] h-[18px]" />
          </span>
          <Input
            className="w-full bg-transparent border border-stone-200 dark:border-stone-700 rounded-lg py-2 pl-9 pr-3 text-sm text-stone-700 dark:text-stone-300 placeholder-stone-400 focus-visible:ring-primary/50 transition-colors h-10 shadow-none"
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
        
        {isLoading ? (
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
          className="bg-primary text-white font-medium text-sm h-12 w-full rounded-full shadow-lg hover:shadow-xl hover:bg-[#8b7662] transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 pointer-events-auto ring-4 ring-white dark:ring-sidebar-dark cursor-pointer"
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