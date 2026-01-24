# PDF Upload Integration Documentation

This document outlines the complete architecture and implementation details of the PDF upload feature in the Read Comp application.

## 1. Architecture Overview

The PDF upload flow is a multi-step process that involves:

1.  **Client-Side UI**: User selects a file via drag-and-drop.
2.  **Direct Upload**: The file is uploaded directly to UploadThing storage.
3.  **Background Processing**: A thumbnail is extracted from the PDF client-side using `pdfjs-dist` and uploaded separately.
4.  **Server Action**: Once uploads are complete, metadata `(title, author, urls)` is sent to the server to create database records.

---

## 2. Core Components

### 2.1 File Upload Infrastructure (`src/app/api/uploadthing/core.ts`)

We use **UploadThing** for file storage. Two endpoints are defined:

- `pdfUploader`: Accepts PDF files up to 32MB.
- `imageUploader`: Accepts Image files up to 4MB (used for generated thumbnails).

**Security**: Both endpoints use middleware to authenticate the user via `better-auth`. Unauthorized requests are rejected.

### 2.2 Client-Side Processing (`src/lib/pdf-utils.ts`)

This utility handles the PDF thumbnail generation completely in the browser to save server resources.

- **Library**: Uses `pdfjs-dist` (v5.x).
- **Dynamic Import**: Uses dynamic imports for the worker script to prevent SSR/Next.js build errors (`DOMMatrix` issues).
- **Logic**:
  1.  Reads the PDF file as an ArrayBuffer.
  2.  Loads the document and fetches Page 1.
  3.  Renders Page 1 to a hidden Canvas element.
  4.  Converts the Canvas to a PNG Blob/File.
  5.  Names the file matching the original PDF name (e.g., `book.pdf` -> `book.png`).

### 2.3 UI Component (`src/components/dashboard/UploadBookDialog.tsx`)

The main interface for the user.

- **State Management**: Tracks file selection, upload progress (circular SVG), saving state, and form inputs.
- **Parallel Workflow**:
  - **PDF Upload**: Starts immediately upon file drop. Shows a circular progress indicator.
  - **Thumbnail Generation**: Runs in the background. If it fails, it alerts the user but doesn't block the flow entirely (though `handleSave` currently requires both URLs).
  - **User Input**: `Title` and `Author` fields remain active during upload so the user can fill them out while waiting.
- **User Feedback**:
  - Toast notifications for success/error.
  - "Adding your book..." loader when saving to the database.
  - Immediate dialog closure for better perceived performance (`toast.promise` handles the background server completion).

### 2.4 Server Action (`src/actions/books.ts`)

Handles the final database insertion.

- **Validation**: Zod schema `uploadBookSchema`.
- **Authentication**: Verifies user session headers.
- **Persistence**:
  1.  Creates a `Book` record with the file URLs and metadata.
  2.  Creates a `UserBook` record to link the book to the user (Status: `NEW`).
- **Concurrency**: Uses sequential Prisma queries instead of transactions (per debugging requirements).

---

## 3. Data Flow Step-by-Step

1.  **User drops file**: `handleDrop` is triggered.
2.  **State Init**: `processFile` sets status to 'uploading'.
3.  **Concurrent Operations**:
    - `startPdfUpload` sends PDF to UploadThing.
    - `extractFirstPageAsImage` generates `thumbnail.png`.
    - `startImageUpload` sends the generated thumbnail to UploadThing.
4.  **Completion**:
    - When PDF finishes -> `uploadedUrl` is set.
    - When Thumbnail finishes -> `thumbnailUrl` is set.
5.  **User submits**: Click "Add Book".
6.  **Server Action**: `createBookAction` is called with metadata.
7.  **Database**:
    - `Book` table: stores URLs, title, author.
    - `UserBook` table: links User + Book.
8.  **Result**: Dialog closes, Toast confirms "Book added successfully", Cache revalidates `/read`.

---

## 4. Key Files & Locations

| Component         | File Path                                       |
| :---------------- | :---------------------------------------------- |
| **UI Dialog**     | `src/components/dashboard/UploadBookDialog.tsx` |
| **PDF Utils**     | `src/lib/pdf-utils.ts`                          |
| **Server Action** | `src/actions/books.ts`                          |
| **File Router**   | `src/app/api/uploadthing/core.ts`               |
| **Validation**    | `src/types/validation.ts`                       |
| **DB Schema**     | `prisma/schema.prisma`                          |

---

## 5. Troubleshooting & common Issues

- **"DOMMatrix is not defined"**: Ensure `pdfjs-dist` is dynamically imported inside `pdf-utils.ts`, not at the top level.
- **"Null constraint violation"**: Often caused by schema mismatch regarding `createdAt`/`updatedAt`. Ensure `prisma db push` or `migrate` is run if schema changes.
- **"Failed to get session"**: Check `trustedOrigins` in `src/lib/auth.ts`. It must match the dev server port (e.g., `http://localhost:3000`).
- **UploadThing Errors**: Verify `UPLOADTHING_TOKEN` in `.env`.
