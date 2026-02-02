'use server';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { Quote } from '@prisma/client';

export type QuoteActionState = {
  success: boolean;
  message: string;
  data?: Quote[] | Quote;
};

export async function getQuotesAction(bookId: string): Promise<QuoteActionState> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return {
        success: false,
        message: 'You must be logged in to view quotes.',
      };
    }

    const userId = session.user.id;

    const quotes = await prisma.quote.findMany({
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
      message: 'Quotes retrieved successfully.',
      data: quotes,
    };
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return {
      success: false,
      message: 'An error occurred while fetching quotes.',
    };
  }
}

export async function saveQuoteAction(
  bookId: string,
  text: string,
  citedPerson?: string
): Promise<QuoteActionState> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return {
        success: false,
        message: 'You must be logged in to save quotes.',
      };
    }

    const userId = session.user.id;

    const savedQuote = await prisma.quote.create({
      data: {
        text,
        citedPerson,
        userId,
        bookId,
      },
    });

    revalidatePath(`/read/${bookId}`);

    return {
      success: true,
      message: 'Quote saved successfully.',
      data: savedQuote,
    };
  } catch (error) {
    console.error('Error saving quote:', error);
    return {
      success: false,
      message: 'Failed to save quote.',
    };
  }
}

export async function deleteQuoteAction(quoteId: string): Promise<QuoteActionState> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return {
        success: false,
        message: 'You must be logged in to delete quotes.',
      };
    }

    const userId = session.user.id;

    // Verify ownership and get bookId for revalidation
    const quote = await prisma.quote.findUnique({
      where: {
        id: quoteId,
        userId,
      },
      select: {
        bookId: true,
      },
    });

    if (!quote) {
      return {
        success: false,
        message: 'Quote not found or you do not have permission to delete it.',
      };
    }

    await prisma.quote.update({
      where: {
        id: quoteId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    revalidatePath(`/read/${quote.bookId}`);

    return {
      success: true,
      message: 'Quote deleted successfully.',
    };
  } catch (error) {
    console.error('Error deleting quote:', error);
    return {
      success: false,
      message: 'Failed to delete quote.',
    };
  }
}
