import React, { useState } from "react";
import { X, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AddQuoteModalProps {
  onClose: () => void;
  onSave?: (quote: string, author: string) => void;
}

const AddQuoteModal = ({ onClose, onSave }: AddQuoteModalProps) => {
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");

  const handleSave = () => {
    if (onSave) {
      onSave(text, author);
    }
    onClose();
  };

  return (
    <div className="absolute bottom-[84px] left-6 right-6 z-40 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-[#f5f1e8] dark:bg-[#1c1a17] rounded-xl shadow-floating border border-sepia-divider dark:border-stone-700 p-5">
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#f5f1e8] dark:bg-[#1c1a17] border-b border-r border-sepia-divider dark:border-stone-700 transform rotate-45"></div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-primary">New Quote Entry</h3>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
          >
            <X className="w-[18px] h-[18px]" />
          </Button>
        </div>
        
        <Textarea 
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-white dark:bg-[#25221e] border-sepia-divider/80 dark:border-stone-700 rounded-lg p-3 text-stone-800 dark:text-stone-200 placeholder-stone-400 focus-visible:ring-primary/20 font-serif text-sm leading-relaxed resize-none h-28 mb-3 shadow-inner-soft transition-all" 
          placeholder="Enter the quote text here..."
        />
        
        <div className="flex items-center gap-2 mb-4 bg-white dark:bg-[#25221e] border border-sepia-divider/80 dark:border-stone-700 rounded-lg px-3 transition-colors focus-within:border-primary/50">
          <Quote className="text-stone-400 w-[18px] h-[18px] shrink-0" />
          <Input 
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="flex-1 bg-transparent border-none p-0 text-sm text-stone-800 dark:text-stone-200 placeholder-stone-400 focus-visible:ring-0 font-serif shadow-none h-10" 
            placeholder="Cited by..." 
          />
        </div>
        
        <Button 
          onClick={handleSave}
          className="w-full bg-primary hover:bg-[#8b7662] text-white font-medium text-sm h-10 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default AddQuoteModal;
