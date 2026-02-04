# Noted - Your Ultimate Reading Companion

## 📖 Project Overview
**Noted** is a sophisticated web-based reading platform designed for students, researchers, and knowledge workers. It provides a focused environment where users can read PDFs while simultaneously capturing notes, saving meaningful quotes, and documenting structured story insights—all in a single, unified interface.

The core philosophy of Noted is to preserve the context of knowledge by keeping your thoughts directly attached to the source material.

---

## ✨ Core Features

### 📚 Personal Library Management
- **Centralized Dashboard**: A clean overview of all your books with thumbnails and progress indicators.
- **Smart Filtering**: Organize your collection by status: *All, New, Reading, Finished,* or *Favorites*.
- **Book Discovery**: Access "Suggested Books" curated for all users, or upload your own private collection.
- **Upload Integration**: Seamless PDF uploads powered by Uploadthing.

### 👓 Immersive Reading Experience
- **Advanced PDF Viewer**: A smooth, high-performance reading interface powered by `@react-pdf-viewer`.
- **Automatic Progress Tracking**: Never lose your place; the app remembers exactly which page you were on for every book.
- **Page Navigation**: Quick jumps and intuitive scrolling for large academic documents.

### 📝 Integrated Knowledge Capture
- **Contextual Notes**: Capture your thoughts as you read. Notes are linked to the book, ensuring they are always available when you return.
- **Manual Quote Collection**: Save impactful quotes along with the cited person/author.
- **Story Insights**: Create structured takeaways and major insights ("Stories") from your reading material.
- **Rich Text Editing**: Notes and stories utilize Tiptap for a modern, distraction-free editing experience.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js (App Router), React 19 |
| **Styling** | Tailwind CSS, Shadcn UI, Framer Motion |
| **Backend** | Next.js Server Actions, Prisma ORM |
| **Database** | PostgreSQL (Neon) |
| **Authentication** | Better Auth |
| **File Storage** | Uploadthing |
| **PDF Processing** | PDF.js, React PDF Viewer |
| **State Management** | Zustand |

---

## 📂 Project Structure

```text
src/
├── app/              # Next.js App Router (Auth, Marketing, Library, Reader)
├── actions/          # Type-safe Server Actions for DB operations
├── components/       # Reusable UI components (shadcn/ui, Reading, Library)
├── lib/              # Utility functions (auth, prisma, pdf-utils, uploadthing)
├── hooks/            # Custom React hooks (use-mobile, use-screen-size)
├── store/            # Zustand stores for global state (Search, Filters, View)
└── types/            # TypeScript definitions and validation schemas
```

---

## 🗄 Database Model

The database is built on PostgreSQL with a focus on ownership and user-specific states:

- **User**: Profile and authentication data.
- **Book**: Metadata for the PDF (Title, Author, URL).
- **UserBook**: Tracks a specific user's relationship with a book (Progress, Favorite status, Reading status).
- **Note/Quote/Story**: User-generated content linked to both the `User` and the `Book`.

---

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   Configure your `.env` with:
   - `DATABASE_URL` (PostgreSQL)
   - `BETTER_AUTH_SECRET`
   - `UPLOADTHING_SECRET` & `UPLOADTHING_APP_ID`

3. **Database Migration**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

---

*Noted aims to transform the way we interact with digital literature, making the transition from reading to retaining seamless and intuitive.*
