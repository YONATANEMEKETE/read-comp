'use server';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

export type NoteActionState = {
  success: boolean;
  message: string;
  data?: any;
};

export async function getNoteAction(bookId: string): Promise<NoteActionState> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return {
        success: false,
        message: 'You must be logged in to view notes.',
      };
    }

    const userId = session.user.id;

    // Find the note for this book and user
    // We take the first one since we are treating it as a single "scratchpad" for now
    const note = await prisma.note.findFirst({
      where: {
        userId,
        bookId,
        deletedAt: null,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return {
      success: true,
      message: 'Note retrieved successfully.',
      data: note,
    };
  } catch (error) {
    console.error('Error fetching note:', error);
    return {
      success: false,
      message: 'An error occurred while fetching the note.',
    };
  }
}

export async function saveNoteAction(
  bookId: string,
  content: string
): Promise<NoteActionState> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return {
        success: false,
        message: 'You must be logged in to save notes.',
      };
    }

    const userId = session.user.id;

    // Check if a note already exists
    const existingNote = await prisma.note.findFirst({
      where: {
        userId,
        bookId,
        deletedAt: null,
      },
    });

    let savedNote;

    if (existingNote) {
      // Update existing note
      savedNote = await prisma.note.update({
        where: { id: existingNote.id },
        data: {
          content,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new note
      savedNote = await prisma.note.create({
        data: {
          content,
          userId,
          bookId,
        },
      });
    }

    // Revalidate the path
    revalidatePath(`/read/${bookId}`);

    return {
      success: true,
      message: 'Note saved successfully.',
      data: savedNote,
    };
  } catch (error) {
    console.error('Error saving note:', error);
    return {
      success: false,
      message: 'Failed to save note.',
    };
  }
}
