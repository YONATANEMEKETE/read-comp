'use client';

import { useState, useRef, useEffect } from 'react';
import { MoreVertical, BookOpen, Heart, Delete } from 'lucide-react';

type BookType = 'your-library' | 'suggested';

interface BookDropdownMenuProps {
  bookType: BookType;
  isFavorite?: boolean;
  onReadNow?: () => void;
  onMarkFavorite?: () => void;
  onDelete?: () => void;
}

export function BookDropdownMenu({
  bookType,
  isFavorite = false,
  onReadNow,
  onMarkFavorite,
  onDelete,
}: BookDropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle option clicks
  const handleOptionClick = (callback?: () => void) => {
    if (callback) callback();
    setIsOpen(false);
  };

  // Define options based on book type
  const options =
    bookType === 'your-library'
      ? [
          { label: 'Read Now', icon: BookOpen, action: onReadNow },
          {
            label: isFavorite ? 'Remove from Favorites' : 'Mark as Favorite',
            icon: Heart,
            action: onMarkFavorite,
          },
          {
            label: 'Delete Book',
            icon: Delete,
            action: onDelete,
            isDangerous: true,
          },
        ]
      : [
          { label: 'Read Now', icon: BookOpen, action: onReadNow },
          {
            label: isFavorite ? 'Remove from Favorites' : 'Mark as Favorite',
            icon: Heart,
            action: onMarkFavorite,
          },
        ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="size-9 flex items-center justify-center rounded-full text-stone-400 hover:text-stone-600 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="More options"
      >
        <MoreVertical size={22} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-stone-800 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-sepia-divider/50 dark:border-stone-700 p-2 flex flex-col gap-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {options.map((option, index) => {
            const IconComponent = option.icon;
            return (
              <button
                key={index}
                className={`flex items-center gap-3 w-full px-3 py-2.5 text-left text-sm font-medium rounded-lg transition-colors ${
                  option.isDangerous
                    ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                    : 'text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-700/50'
                }`}
                onClick={() => handleOptionClick(option.action)}
              >
                <IconComponent
                  size={20}
                  className={
                    option.label.includes('Remove from Favorites')
                      ? 'text-[#cda2a2] fill-current' // Filled heart for favorite
                      : option.isDangerous
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-stone-400'
                  }
                />
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
