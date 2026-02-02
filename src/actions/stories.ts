'use server';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { Story } from '@prisma/client';

export type StoryActionState = {
  success: boolean;
  message: string;
  data?: Story[] | Story;
};

export async function getStoriesAction(bookId: string): Promise<StoryActionState> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return {
        success: false,
        message: 'You must be logged in to view stories.',
      };
    }

    const userId = session.user.id;

    const stories = await prisma.story.findMany({
      where: {
        userId,
        bookId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      message: 'Stories retrieved successfully.',
      data: stories,
    };
  } catch (error) {
    console.error('Error fetching stories:', error);
    return {
      success: false,
      message: 'An error occurred while fetching stories.',
    };
  }
}

export async function saveStoryAction(
  bookId: string,
  content: string
): Promise<StoryActionState> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return {
        success: false,
        message: 'You must be logged in to save stories.',
      };
    }

    const userId = session.user.id;

    const savedStory = await prisma.story.create({
      data: {
        content,
        userId,
        bookId,
      },
    });

    revalidatePath(`/read/${bookId}`);

    return {
      success: true,
      message: 'Story saved successfully.',
      data: savedStory,
    };
  } catch (error) {
    console.error('Error saving story:', error);
    return {
      success: false,
      message: 'Failed to save story.',
    };
  }
}

export async function deleteStoryAction(storyId: string): Promise<StoryActionState> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return {
        success: false,
        message: 'You must be logged in to delete stories.',
      };
    }

    const userId = session.user.id;

    // Verify ownership and get bookId for revalidation
    const story = await prisma.story.findUnique({
      where: {
        id: storyId,
        userId,
      },
      select: {
        bookId: true,
      },
    });

    if (!story) {
      return {
        success: false,
        message: 'Story not found or you do not have permission to delete it.',
      };
    }

    await prisma.story.update({
      where: {
        id: storyId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    revalidatePath(`/read/${story.bookId}`);

    return {
      success: true,
      message: 'Story deleted successfully.',
    };
  } catch (error) {
    console.error('Error deleting story:', error);
    return {
      success: false,
      message: 'Failed to delete story.',
    };
  }
}
