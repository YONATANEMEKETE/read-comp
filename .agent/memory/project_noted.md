# Project Rule: Noted - Reading Companion Application

## Project Identity

**Project Name**: Noted  
**Type**: Web-based reading companion for PDFs with integrated note-taking  
**Tech Stack**: Next.js 16 (App Router), TypeScript, Prisma, PostgreSQL, Better Auth, Shadcn/UI, Tailwind CSS 4

---

## Design System & Theming

### CRITICAL: Always Use Established Theme

This project has a **carefully crafted design system** defined in `src/app/globals.css`. **NEVER introduce arbitrary colors, fonts, or design tokens.**

#### Color Palette

**Light Mode:**

- Background: `#faf9f6` (warm, paper-like)
- Foreground: `#292524` (dark brown)
- Primary: `#9a8470` (muted brown)
- Secondary: `#e5ddd3` (sepia divider)
- Accent colors: Dusty rose (`#cda2a2`), Sage green (`#9fb1a2`), Muted blue (`#a5b2bd`)

**Dark Mode:**

- Background: `#1d1a15` (deep brown-black)
- Foreground: `#e7e5e4` (warm white)
- Card: `#111318` (sidebar dark)
- Borders/Muted: `#292524`

**Always use Tailwind color classes** that reference these CSS variables:

- `bg-background`, `text-foreground`, `bg-card`, `text-primary`, `border-border`, etc.
- Custom colors: `bg-warm-bg`, `bg-sepia-divider`, `text-dusty-rose`, `text-sage-green`, `text-muted-blue`

#### Typography

**Fonts** (defined in `src/app/layout.tsx`):

- **Sans-serif**: `Inter` (weights: 300, 400, 600, 800, 900) — use `font-sans`
- **Serif**: `Noto Serif` (weights: 300, 400, 500, 600, 700) — use `font-serif` or `font-display`

**Default body font**: `font-sans`  
**Use `font-serif` for**: Headings, quotes, book titles, or content that needs elegance

#### Spacing & Borders

- **Border radius**: Use `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-3xl`, `rounded-4xl` (based on `--radius: 0.75rem`)
- **Shadows**: Use `shadow-soft` and `shadow-inner-soft` utility classes
- **Grain texture**: A subtle noise overlay is applied via `.bg-grain` for a paper-like feel

---

## External UI Assets (Public Folder)

### Important Context

The `public/` folder contains **externally generated UI mockups** in subfolders like:

- `public/auth-pages/`
- `public/read-page-ui/`
- `public/stitch_book_library_dashboard/`

These folders include:

- HTML files with inline styles
- Images and assets
- **Their own fonts and color schemes** (which DO NOT match the project theme)

### Rules for Handling External UI

1. **DO NOT copy colors or fonts from these HTML files**
2. **DO NOT use inline styles from these mockups**
3. **ONLY extract structural/layout patterns** (grid layouts, component hierarchy, spacing concepts)
4. **Convert all designs to use the project's theme** from `globals.css`
5. **Replace all fonts with `font-sans` or `font-serif`**
6. **Use Shadcn/UI components** instead of custom HTML elements where possible

### Workflow for Converting External UI

When implementing a feature based on external UI mockups:

1. **Analyze the layout structure** (not the styling)
2. **Identify reusable patterns** (cards, grids, sidebars)
3. **Rebuild using**:
   - Tailwind classes with project theme colors
   - Shadcn/UI components (`Button`, `Card`, `Dialog`, etc.)
   - Project fonts (`font-sans`, `font-serif`)
4. **Add Framer Motion animations** for polish (use the `motion` package)
5. **Ensure responsive design** with Tailwind breakpoints

---

## Component Development Standards

### Use Shadcn/UI First

Before building custom components, **always check if Shadcn/UI has a component** for that use case:

- Buttons, Inputs, Dialogs, Dropdowns, Tooltips, etc.
- Install via: `npx shadcn@latest add <component-name>`

### Component Structure

```typescript
// Example component structure
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface MyComponentProps {
  title: string;
  onAction: () => void;
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  return (
    <Card className="bg-card border-border rounded-xl p-6">
      <h2 className="font-serif text-2xl text-foreground">{title}</h2>
      <Button onClick={onAction} className="bg-primary text-primary-foreground">
        Take Action
      </Button>
    </Card>
  );
}
```

### Styling Rules

1. **Use Tailwind utility classes** (no inline styles or CSS modules unless absolutely necessary)
2. **Reference theme colors** via CSS variables (`bg-background`, `text-primary`, etc.)
3. **Responsive design**: Mobile-first with `sm:`, `md:`, `lg:`, `xl:` breakpoints
4. **Dark mode**: Use `dark:` variant (e.g., `dark:bg-background-dark`)
5. **Animations**: Use Framer Motion for interactive elements

---

## Database & Data Fetching

### Prisma Models

Key entities:

- `User` (Better Auth integration)
- `Book` (PDF metadata, privacy system)
- `UserBook` (reading progress, favorites)
- `Note`, `Quote`, `Story` (captured content)

### Soft Deletes

Most models use `deletedAt` for soft deletion. **Always filter out soft-deleted records**:

```typescript
const activeBooks = await prisma.book.findMany({
  where: { deletedAt: null },
});
```

### Server Actions

Use Server Actions in `src/actions/` for database mutations:

```typescript
'use server';

import { prisma } from '@/lib/prisma';

export async function createNote(bookId: string, content: string) {
  // Validate user session
  // Create note in database
  // Return result
}
```

---

## Authentication

### Better Auth Setup

- **Server config**: `src/lib/auth.ts`
- **Client config**: `src/lib/auth-client.ts`
- **API route**: `src/app/api/auth/[...all]/route.ts`

### Protected Routes

Use middleware or session checks:

```typescript
import { auth } from '@/lib/auth';

export async function getServerSideProps() {
  const session = await auth();
  if (!session) {
    redirect('/login');
  }
  // ...
}
```

---

## File Organization

```
src/
├── app/
│   ├── (auth)/          # Login, signup pages
│   ├── (marketing)/     # Landing, features, FAQ
│   ├── read/            # PDF reading interface
│   ├── api/             # API routes
│   ├── layout.tsx       # Root layout with fonts
│   └── globals.css      # Theme and design tokens
├── components/
│   ├── ui/              # Shadcn/UI components
│   └── common/          # Custom reusable components
├── actions/             # Server Actions
├── lib/                 # Utilities (Prisma, Auth, etc.)
├── hooks/               # Custom React hooks
└── types/               # TypeScript type definitions
```

---

## Code Quality Standards

1. **TypeScript strict mode**: Always define proper types
2. **No `any` types**: Use `unknown` or proper types
3. **Path aliases**: Use `@/` for imports (e.g., `@/components/ui/button`)
4. **Functional components**: Use React functional components with hooks
5. **Accessibility**: Ensure ARIA labels, keyboard navigation, semantic HTML
6. **Error handling**: Implement proper error boundaries and user feedback

---

## Development Workflow

1. **Check PRD.md** for feature requirements
2. **Review Prisma schema** for data structure
3. **Use Shadcn/UI components** where possible
4. **Follow the theme** from `globals.css`
5. **Test in both light and dark modes**
6. **Ensure responsive design** on all screen sizes

---

## Key Principles

✅ **DO:**

- Use the established color palette and fonts
- Leverage Shadcn/UI components
- Follow the soft delete pattern
- Implement proper TypeScript types
- Add Framer Motion animations for polish
- Ensure dark mode compatibility

❌ **DON'T:**

- Copy colors/fonts from external UI mockups
- Use inline styles or arbitrary colors
- Skip accessibility considerations
- Ignore the PRD.md requirements
- Forget to handle loading and error states

---

## Quick Reference

**Theme colors**: `globals.css` lines 62-129  
**Fonts**: `layout.tsx` lines 6-18  
**Database schema**: `prisma/schema.prisma`  
**PRD**: `PRD.md`  
**Shadcn components**: `src/components/ui/`
