'use server';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { uploadBookSchema, UploadBookInput } from '@/types/validation';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { BookWithProgress } from '@/types/book';

export type BookActionState = {
  success: boolean;
  message: string;
  bookId?: string;
  errors?: Record<string, string[]>;
};

export async function createBookAction(
  data: UploadBookInput,
): Promise<BookActionState> {
  // 1. Validate Input
  const validatedFields = uploadBookSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validatedFields.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const { title, author, pdfUrl, thumbnailUrl } = validatedFields.data;

  try {
    // 2. Get User Session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return {
        success: false,
        message: 'You must be logged in to upload a book.',
      };
    }

    const userId = session.user.id;

    // 3. Create Book and UserBook in a transaction
    // We check if a book with the same PDF already exists (optional, but good practice per user context might vary)
    // For now, we'll assume every upload is a new book as per the schema logic which doesn't force unique PDFs globally strictly yet.
    // However, if we want to share books, we might want to check.
    // Given the prompt "insert the book record and the userbook", we'll do straight insert.

    // 3. Create Book directly
    console.log('--- Creating Book ---');
    console.log('User ID:', userId);
    console.log('Data:', { title, author, pdfUrl, thumbnailUrl });

    const book = await prisma.book.create({
      data: {
        title,
        author,
        pdfUrl,
        thumbnailUrl,
        isSuggested: false,
        uploaderId: userId,
      },
    });

    // 4. Create UserBook entry linking the user to the book
    await prisma.userBook.create({
      data: {
        userId,
        bookId: book.id,
        status: 'NEW',
        progressPage: 1,
      },
    });

    const result = book;

    // 4. Revalidate cache
    revalidatePath('/read');

    return {
      success: true,
      message: 'Book added successfully!',
      bookId: result.id,
    };
  } catch (error) {
    console.error('Error creating book:', error);
    return {
      success: false,
      message: 'Failed to create book. Please try again.',
    };
  }
}

export async function getUserBooks(): Promise<BookWithProgress[]> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    return [];
  }

  try {
    const userBooks = await prisma.userBook.findMany({
      where: {
        userId: session.user.id,
        book: {
          isSuggested: false,
        },
        deletedAt: null, // Only include books that haven't been soft-deleted
      },
      include: {
        book: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return userBooks.map((ub) => ({
      ...ub.book,
      createdAt: ub.book.createdAt.toISOString(),
      updatedAt: ub.book.updatedAt.toISOString(),
      deletedAt: ub.book.deletedAt ? ub.book.deletedAt.toISOString() : null,
      userProgress: {
        ...ub,
        createdAt: ub.createdAt.toISOString(),
        updatedAt: ub.updatedAt.toISOString(),
        deletedAt: ub.deletedAt ? ub.deletedAt.toISOString() : null,
        book: {
          ...ub.book,
          createdAt: ub.book.createdAt.toISOString(),
          updatedAt: ub.book.updatedAt.toISOString(),
          deletedAt: ub.book.deletedAt ? ub.book.deletedAt.toISOString() : null,
        },
      },
    }));
  } catch (error) {
    console.error('Error fetching user books:', error);
    return [];
  }
}

export async function getSuggestedBooks(): Promise<BookWithProgress[]> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user?.id;

  try {
    const suggestedBooks = await prisma.book.findMany({
      where: {
        isSuggested: true,
      },
      include: {
        userProgress: userId
          ? {
              where: {
                userId: userId,
              },
              take: 1, // Only need one record since userId+bookId is unique
            }
          : {
              where: {
                userId: {
                  in: [], // This will return an empty array when no userId
                },
              },
            },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return suggestedBooks.map((book) => {
      const userProgressRaw = book.userProgress?.[0];

      let userProgress = undefined;

      if (userProgressRaw) {
        userProgress = {
          ...userProgressRaw,
          createdAt: userProgressRaw.createdAt.toISOString(),
          updatedAt: userProgressRaw.updatedAt.toISOString(),
          deletedAt: userProgressRaw.deletedAt
            ? userProgressRaw.deletedAt.toISOString()
            : null,
          book: {
            ...book,
            createdAt: book.createdAt.toISOString(),
            updatedAt: book.updatedAt.toISOString(),
            deletedAt: book.deletedAt ? book.deletedAt.toISOString() : null,
          },
        };
      }

      return {
        ...book,
        createdAt: book.createdAt.toISOString(),
        updatedAt: book.updatedAt.toISOString(),
        deletedAt: book.deletedAt ? book.deletedAt.toISOString() : null,
        userProgress,
      };
    });
  } catch (error) {
    console.error('Error fetching suggested books:', error);
    return [];
  }
}

export type UpdateBookFavoriteActionState = {
  success: boolean;
  message: string;
  data?: any;
};

export async function updateBookFavoriteAction(
  bookId: string,
  isFavorite: boolean
): Promise<UpdateBookFavoriteActionState> {
  try {
    // Get user session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return {
        success: false,
        message: 'You must be logged in to update book favorite status.',
      };
    }

    const userId = session.user.id;

    // Update the user book favorite status
    const updatedUserBook = await prisma.userBook.update({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
      data: {
        isFavorite,
        updatedAt: new Date(),
      },
    });

    // Revalidate the relevant paths
    revalidatePath('/read');
    revalidatePath('/read/yourlibraries');

    return {
      success: true,
      message: isFavorite ? 'Book marked as favorite' : 'Book removed from favorites',
      data: updatedUserBook,
    };
  } catch (error) {
    console.error('Error updating book favorite status:', error);
    return {
      success: false,
      message: 'Failed to update book favorite status. Please try again.',
    };
  }
}

export type UpdateBookDeleteActionState = {
  success: boolean;
  message: string;
  data?: any;
};

export async function updateBookDeleteAction(
  bookId: string
): Promise<UpdateBookDeleteActionState> {
  try {
    // Get user session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return {
        success: false,
        message: 'You must be logged in to delete a book.',
      };
    }

    const userId = session.user.id;

    // Update the user book record to mark as deleted (soft delete)
    const updatedUserBook = await prisma.userBook.update({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Revalidate the relevant paths
    revalidatePath('/read');
    revalidatePath('/read/yourlibraries');

    return {
      success: true,
      message: 'Book removed from your library',
      data: updatedUserBook,
    };
  } catch (error) {
    console.error('Error deleting book:', error);
    return {
      success: false,
      message: 'Failed to delete book. Please try again.',
    };
  }
}
