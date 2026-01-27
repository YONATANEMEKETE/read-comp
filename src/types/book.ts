export type ReadingStatus = 'NEW' | 'READING' | 'FINISHED';

export interface Book {
  id: string;
  title: string;
  author: string;
  thumbnailUrl: string;
  pdfUrl: string;
  totalPages: number;
  isSuggested: boolean;
  uploaderId?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface UserBook {
  id: string;
  userId: string;
  bookId: string;
  status: ReadingStatus;
  isFavorite: boolean;
  progressPage: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  book: Book;
}

export type BookWithProgress = Book & {
  userProgress?: UserBook;
};
