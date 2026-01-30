import { Book as PrismaBook, UserBook as PrismaUserBook } from '@prisma/client';
import { BookWithProgress, UserBook } from '@/types/book';

/**
 * Maps Prisma Book and UserBook models to the frontend BookWithProgress type.
 * Handles ISO string conversion for dates and nested structure.
 */
export function mapBookToProgress(
  book: PrismaBook & { userProgress?: PrismaUserBook[] | PrismaUserBook | null }
): BookWithProgress {
  const userProgressRaw = Array.isArray(book.userProgress) 
    ? book.userProgress[0] 
    : book.userProgress;

  let userProgress: UserBook | undefined = undefined;

  if (userProgressRaw) {
    userProgress = {
      ...userProgressRaw,
      createdAt: userProgressRaw.createdAt.toISOString(),
      updatedAt: userProgressRaw.updatedAt.toISOString(),
      deletedAt: userProgressRaw.deletedAt ? userProgressRaw.deletedAt.toISOString() : null,
      // The UserBook type in book.ts expects a 'book' property
      book: {
        ...book,
        createdAt: book.createdAt.toISOString(),
        updatedAt: book.updatedAt.toISOString(),
        deletedAt: book.deletedAt ? book.deletedAt.toISOString() : null,
      } as any, // Cast to any to avoid circular dependency issues in types if they arise
    };
  }

  return {
    ...book,
    createdAt: book.createdAt.toISOString(),
    updatedAt: book.updatedAt.toISOString(),
    deletedAt: book.deletedAt ? book.deletedAt.toISOString() : null,
    userProgress,
  };
}
