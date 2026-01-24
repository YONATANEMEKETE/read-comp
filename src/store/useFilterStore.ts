import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define what our filter state looks like
export interface FilterState {
  reading: boolean;
  onShelf: boolean;
  finished: boolean;
}

// Define the store interface
interface FilterStore {
  filters: FilterState;
  setFilters: (
    filters: FilterState | ((prev: FilterState) => FilterState),
  ) => void;
}

// Create the store with default values
// By default, show all books (all filters are true)
export const useFilterStore = create<FilterStore>()(
  persist(
    (set) => ({
      filters: {
        reading: true,
        onShelf: true,
        finished: true,
      },
      setFilters: (filters) =>
        set((state) => ({
          filters:
            typeof filters === 'function' ? filters(state.filters) : filters,
        })),
    }),
    {
      name: 'library-filter-storage', // LocalStorage key
    },
  ),
);
