import { YourList } from '@/components/library/YourList';
import { SuggestedList } from '@/components/library/SuggestedList';
import { Suspense } from 'react';

function LibraryContent() {
  return (
    <div className="flex-1 overflow-y-auto scroll-smooth">
      <div className="container max-w-7xl mx-auto py-8 px-6 md:px-10 space-y-12">
        <YourList />
        <SuggestedList />
      </div>
    </div>
  );
}

export default function LibraryPage() {
  return (
    <Suspense
      fallback={<div className="p-10 text-stone-400">Loading library...</div>}
    >
      <LibraryContent />
    </Suspense>
  );
}
