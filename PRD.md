# Product Requirements Document (PRD) - Noted

## 1. What is Noted?

Noted is a web-based reading companion that lets users **read books (PDFs), take notes, save quotes, and capture story insights** in one focused interface.

Instead of switching between a reader and separate note-taking tools, users do all their thinking **directly beside the book they are reading**. Notes, quotes, and stories are always attached to the book, preserving context and making knowledge easier to revisit.

## 2. Target Users

- Students reading textbooks and academic PDFs
- Researchers and knowledge workers
- Serious non-fiction readers

## 3. Core User Flow

1. User signs up or logs in.
2. User sees their personal book library.
3. User uploads a PDF or selects an existing book.
4. User opens a book.
5. User reads the book.
6. While reading, the user:
   - Writes notes (not tied to specific pages).
   - Manually saves quotes (including the text and the name of the person being cited).
   - Creates story insights (structured takeaways).
7. User leaves the app.
8. User returns later and continues reading with all data preserved.

## 4. Core Features (MVP)

### Book Library

- List of books owned by the user.
- Each book displays: Thumbnail, Title, Date added.
- Filters: All, New, Reading, Finished, Favorites.

### Reading Experience

- Open a book in a dedicated reading view.
- Smooth PDF reading experience.
- Reading progress is saved automatically.
- User can resume reading where they left off.

### Notes

- Create notes while reading.
- Notes are always linked to the book but **not** to specific page numbers.
- Notes remain available whenever the book is reopened.

### Quotes (Manual)

- Users manually input quotes they find meaningful.
- **Fields**: Quote Text, Cited Person Name (Author/Speaker).
- Quotes are linked to the book they come from.
- Quotes are **not** tied to page numbers or specific text highlights.

### Stories

- Create short story insights manually.
- Stories represent structured takeaways from the book.
- Stories are linked to the active book.

## 5. Database Design

### Overview
The database uses PostgreSQL with Prisma ORM. It implements a soft delete pattern and separates book metadata from user-specific relationships.

### Key Concepts

**Book Ownership & Privacy**
- **Private Books**: Books uploaded by users (`uploaderId` set) - visible only to the uploader
- **Suggested Books**: System-wide recommendations (`isSuggested = true`, `uploaderId` null) - visible to all users

**User-Book Relationship**
- `UserBook` table separates the physical book from personal state (reading status, favorites, progress)
- Each user has their own relationship with a book, allowing different states for different users

### Core Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `User` | User accounts (Better Auth) | `id`, `email`, `name` |
| `Book` | Book metadata & PDF storage | `title`, `author`, `pdfUrl`, `fileKey`, `isSuggested`, `uploaderId` |
| `UserBook` | User's relationship with a book | `userId`, `bookId`, `status`, `isFavorite`, `progressPage` |
| `Note` | User notes linked to a book | `content`, `userId`, `bookId` |
| `Quote` | Manually saved quotes | `text`, `citedPerson`, `userId`, `bookId` |
| `Story` | Structured insights/takeaways | `content`, `userId`, `bookId` |

### Enums

**ReadingStatus**
- `NEW`: Book not started
- `READING`: Currently reading
- `FINISHED`: Completed

### Soft Deletes
All main entities (`Book`, `UserBook`, `Note`, `Quote`, `Story`) include `deletedAt` for soft deletion. User accounts do not use soft deletes.

### Relations
- `User` → `Book` (1:N) via `uploaderId` (uploaded books)
- `User` ↔ `Book` (N:M) via `UserBook` (reading progress/favorites)
- `User` → `Note` (1:N)
- `User` → `Quote` (1:N)
- `User` → `Story` (1:N)
- `Book` → `Note` (1:N)
- `Book` → `Quote` (1:N)
- `Book` → `Story` (1:N)

## 6. Technology Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (via Neon) + Prisma
- **Auth**: Better Auth
- **UI**: Shadcn/UI + Tailwind CSS
- **Animations**: Framer Motion
- **File Upload**: Uploadthing
