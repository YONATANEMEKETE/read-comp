'use server';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { uploadBookSchema, UploadBookInput } from '@/types/validation';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { BookWithProgress } from '@/types/book';
import { mapBookToProgress } from '@/lib/book-utils';

export type BookActionState = {
  success: boolean;
  message: string;
  bookId?: string;
  errors?: Record<string, string[]>;
};

export type GetBookActionState = {
  success: boolean;
  message: string;
  data?: BookWithProgress;
};

export async function getBookWithProgressAction(
  bookId: string
): Promise<GetBookActionState> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return {
        success: false,
        message: 'You must be logged in to view a book.',
      };
    }

    const userId = session.user.id;

    // 1. Find the book
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      include: {
        userProgress: {
          where: { userId },
        },
      },
    });

    if (!book) {
      return {
        success: false,
        message: 'Book not found.',
      };
    }

    // 2. If no userProgress exists (e.g. it's a suggested book the user just opened), create it
    if (book.userProgress.length === 0) {
      const newUserBook = await prisma.userBook.create({
        data: {
          userId,
          bookId,
          status: 'READING',
          progressPage: 1,
        },
      });
      
      // Update the local book object to include the new progress for mapping
      (book as any).userProgress = [newUserBook];
      
      // Revalidate since a new library entry was effectively created
      revalidatePath('/read');
    }

    // 3. If userProgress exists but status is NEW, update to READING
    if (book.userProgress.length > 0 && book.userProgress[0].status === 'NEW') {
      const updatedUserBook = await prisma.userBook.update({
        where: {
          userId_bookId: {
            userId,
            bookId,
          },
        },
        data: {
          status: 'READING',
          updatedAt: new Date(),
        },
      });
      
      // Update the local book object
      (book as any).userProgress[0] = updatedUserBook;
    }

    return {
      success: true,
      message: 'Book retrieved successfully.',
      data: mapBookToProgress(book),
    };
  } catch (error) {
    console.error('Error fetching book progress:', error);
    return {
      success: false,
      message: 'An error occurred while fetching the book.',
    };
  }
}

export async function createBookAction(
  data: UploadBookInput,
): Promise<BookActionState> {
  // ... (rest of the file content remains the same, but using mapBookToProgress for consistency where applicable)
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

  const { title, author, pdfUrl, thumbnailUrl, totalPages } = validatedFields.data;

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
    console.log('Data:', { title, author, pdfUrl, thumbnailUrl, totalPages });

    const book = await prisma.book.create({
      data: {
        title,
        author,
        pdfUrl,
        thumbnailUrl,
        totalPages,
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
        deletedAt: null,
      },
      include: {
        book: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return userBooks.map((ub) => 
      mapBookToProgress({
        ...ub.book,
        userProgress: ub,
      })
    );
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

    return suggestedBooks.map((book) => mapBookToProgress(book));
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

export async function getFavoriteBooks(): Promise<BookWithProgress[]> {
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
        isFavorite: true, // Only include books marked as favorite
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

    return userBooks.map((ub) => 
      mapBookToProgress({
        ...ub.book,
        userProgress: ub,
      })
    );
  } catch (error) {
    console.error('Error fetching favorite books:', error);
    return [];
  }
}

export type UpdateReadingProgressActionState = {
  success: boolean;
  message: string;
  data?: any;
};

export async function updateReadingProgressAction(
  bookId: string,
  progressPage: number,
  status?: 'NEW' | 'READING' | 'FINISHED'
): Promise<UpdateReadingProgressActionState> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return {
        success: false,
        message: 'You must be logged in to update reading progress.',
      };
    }

    const userId = session.user.id;

    // Build update data
    const updateData: any = {
      progressPage,
      updatedAt: new Date(),
    };
    
    // If status is provided, update it
    if (status) {
      updateData.status = status;
    }

    // Update the user book progress
    const updatedUserBook = await prisma.userBook.update({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
      data: updateData,
    });

    return {
      success: true,
      message: 'Reading progress updated successfully.',
      data: updatedUserBook,
    };
  } catch (error) {
    console.error('Error updating reading progress:', error);
    return {
      success: false,
      message: 'Failed to update reading progress.',
    };
  }
}

export type RestartBookActionState = {
  success: boolean;
  message: string;
  data?: any;
};

export async function restartBookAction(
  bookId: string
): Promise<RestartBookActionState> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return {
        success: false,
        message: 'You must be logged in to restart a book.',
      };
    }

    const userId = session.user.id;

    // Update the user book to reset progress and status
    const updatedUserBook = await prisma.userBook.update({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
      data: {
        status: 'READING',
        progressPage: 1,
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      message: 'Book restarted successfully.',
      data: updatedUserBook,
    };
  } catch (error) {
    console.error('Error restarting book:', error);
    return {
      success: false,
      message: 'Failed to restart book.',
    };
  }
}