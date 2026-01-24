'use server';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { uploadBookSchema, UploadBookInput } from '@/types/validation';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

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
    revalidatePath('/dashboard');
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
