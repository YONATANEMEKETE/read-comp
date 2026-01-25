import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SearchState {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      searchTerm: '',
      setSearchTerm: (term) => set({ searchTerm: term }),
    }),
    {
      name: 'search-storage', // LocalStorage key
    },
  ),
);