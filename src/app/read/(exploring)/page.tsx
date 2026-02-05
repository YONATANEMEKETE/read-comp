import { YourList } from '@/components/library/YourList';
import { SuggestedList } from '@/components/library/SuggestedList';
import { Suspense } from 'react';
import { getUserBooks, getSuggestedBooks } from '@/actions/books';
import { ContinueReadingCard } from '@/components/library/ContinueReadingCard';

function LibraryContent() {
  const userBooksPromise = getUserBooks();
  const suggestedBooksPromise = getSuggestedBooks();
  return (
    <div className="flex-1 overflow-y-auto scroll-smooth">
      <div className="container max-w-7xl mx-auto py-6 md:py-10 px-4 sm:px-6 md:px-10 space-y-8 md:space-y-12">
        <ContinueReading
          userBooksPromise={userBooksPromise}
          suggestedBooksPromise={suggestedBooksPromise}
        />
        <YourList />
        <SuggestedList />
      </div>
    </div>
  );
}

async function ContinueReading({
  userBooksPromise,
  suggestedBooksPromise,
}: {
  userBooksPromise: Promise<any>;
  suggestedBooksPromise: Promise<any>;
}) {
  const [userBooks, suggestedBooks] = await Promise.all([
    userBooksPromise,
    suggestedBooksPromise,
  ]);
  const latest = userBooks?.[0] || suggestedBooks?.[0];

  if (!latest) return null;
  return <ContinueReadingCard book={latest} />;
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
