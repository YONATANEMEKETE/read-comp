import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import QuoteCard from './quotes/QuoteCard';
import AddQuoteModal from './quotes/AddQuoteModal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const INITIAL_QUOTES = [
  {
    id: 1,
    text: 'When System 1 runs into difficulty, it calls on System 2 to support more detailed and specific processing that may solve the problem of the moment.',
    author: 'Ronald Richards',
  },
  {
    id: 2,
    text: 'System 2 is mobilized when a question arises for which System 1 does not offer an answer, as happened to you when you encountered the multiplication problem 17 × 24.',
    author: 'Devon Lane',
  },
  {
    id: 3,
    text: 'System 2 is activated when an event is detected that violates the model of the world that System 1 maintains.',
    author: 'Cody Fisher',
  },
  {
    id: 4,
    text: 'In this world, lamps do not jump, cats do not bark, and gorillas do not cross basketball courts.',
    author: 'Esther Howard',
  },
];

const QuoteContent = () => {
  const [quotes, setQuotes] = useState(INITIAL_QUOTES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSaveQuote = (text: string, author: string) => {
    if (!text.trim()) return;

    const newQuote = {
      id: Date.now(),
      text,
      author: author || 'Unknown',
    };
    setQuotes([newQuote, ...quotes]);
  };

  const filteredQuotes = quotes.filter(
    (quote) =>
      quote.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.author.toLowerCase().includes(searchQuery.toLowerCase()),
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
          <div className="absolute inset-0 bg-warm-bg/70 dark:bg-sidebar-dark/80 backdrop-blur-[2px] z-20 transition-all duration-500"></div>
        )}

        {filteredQuotes.map((quote) => (
          <QuoteCard key={quote.id} text={quote.text} author={quote.author} />
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AddQuoteModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveQuote}
        />
      )}

      {/* Add Button */}
      <div className="absolute bottom-6 left-0 right-0 px-6 flex justify-center pointer-events-none z-30">
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white font-medium text-sm px-10 rounded-xl shadow-lg hover:shadow-xl hover:bg-[#8b7662] transition-all transform hover:-translate-y-0.5 flex items-center gap-2 pointer-events-auto ring-4 ring-white dark:ring-sidebar-dark cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Add Quote
        </Button>
      </div>
    </div>
  );
};

export default QuoteContent;
