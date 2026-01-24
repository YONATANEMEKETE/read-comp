import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ViewType = 'grid' | 'list';

interface ViewStore {
  view: ViewType;
  setView: (view: ViewType) => void;
}

export const useViewStore = create<ViewStore>()(
  persist(
    (set) => ({
      view: 'grid',
      setView: (view) => set({ view }),
    }),
    {
      name: 'library-view-storage',
    },
  ),
);
