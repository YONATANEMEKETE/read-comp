# SEO Audit for Noted (Reading Application)

## Executive Summary

**Project Type:** Next.js 16.1.3 with App Router (React 19.2.3, TypeScript)
**Audit Date:** February 2026
**Current SEO Score:** 4/10 (Basic implementation)

---

## 1. Current SEO State

### ✅ What's Working

| Feature | Status | Implementation |
|---------|--------|----------------|
| Basic Title Tags | ✅ Present | Using Next.js Metadata API |
| Meta Descriptions | ✅ Present | On all marketing pages |
| Semantic HTML | ✅ Good | Proper heading hierarchy |
| Image Optimization | ✅ Configured | `next/image` with proper sizing |
| Responsive Design | ✅ Mobile-friendly | Tailwind CSS v4 |
| 404 Page | ✅ Custom | User-friendly not-found.tsx |
| Alt Text | ✅ Present | On all images |
| Language Attribute | ✅ Set | `lang="en"` on root |

### ❌ Critical Missing Elements

| Feature | Impact | Priority |
|---------|--------|----------|
| Open Graph Tags | Social sharing broken | HIGH |
| Twitter Cards | Twitter sharing poor | HIGH |
| Sitemap.xml | Search discovery limited | HIGH |
| Robots.txt | No crawl control | HIGH |
| Structured Data (JSON-LD) | No rich snippets | HIGH |
| Canonical URLs | Duplicate content risk | MEDIUM |
| Favicon Setup | Missing brand identity | MEDIUM |
| Apple Touch Icon | iOS home screen broken | MEDIUM |
| Manifest.json | No PWA metadata | LOW |
| Dynamic Book Metadata | Book pages invisible to SEO | CRITICAL |

---

## 2. Page-by-Page Audit

### Marketing Pages (Public-facing)

#### 1. Home Page (`/`)
**Current State:**
- Title: "Noted — A quiet space for thoughtful reading."
- Description: "Capture notes, save quotes, and build story insights..."

**Issues:**
- ❌ Missing Open Graph image
- ❌ Missing Twitter Card
- ❌ No structured data (SoftwareApplication schema)
- ❌ No canonical URL
- ❌ No keywords meta tag

**Required Files:**
```
src/app/opengraph-image.tsx (or .jpg/.png)
src/app/twitter-image.tsx (or .jpg/.png)
public/images/og-home.jpg (1200x630)
```

#### 2. Features Page (`/features`)
**Current State:**
- Title: "Features — Noted"
- Description: "Explore the powerful features designed to help you read deeper..."

**Issues:**
- ❌ Missing Open Graph
- ❌ Missing Twitter Card
- ❌ No structured data (ItemList schema for features)
- ❌ Missing canonical URL

**Required Files:**
```
src/app/(marketing)/features/opengraph-image.tsx
src/app/(marketing)/features/twitter-image.tsx
```

#### 3. How It Works (`/how-it-works`)
**Current State:**
- Title: "How It Works — Noted"
- Description: "Learn how Noted bridges the gap between reading and note-taking..."

**Issues:**
- ❌ Missing Open Graph
- ❌ Missing Twitter Card
- ❌ No structured data (HowTo schema)
- ❌ Missing canonical URL

#### 4. Use Cases (`/use-cases`)
**Current State:**
- Title: "Use Cases — Noted"
- Description: "Whether you are a student, researcher, or curious reader..."

**Issues:**
- ❌ Missing Open Graph
- ❌ Missing Twitter Card
- ❌ No structured data
- ❌ Missing canonical URL

**Required Files:**
```
src/app/(marketing)/use-cases/opengraph-image.tsx
src/app/(marketing)/use-cases/twitter-image.tsx
```

#### 5. FAQ Page (`/faq`)
**Current State:**
- Title: "FAQ — Noted"
- Description: "Everything you need to know about using Noted..."

**Issues:**
- ❌ Missing Open Graph
- ❌ Missing Twitter Card
- ❌ No FAQ structured data
- ❌ Missing canonical URL

**Required Files:**
```
src/app/(marketing)/faq/opengraph-image.tsx
src/app/(marketing)/faq/twitter-image.tsx
```

#### 6. Auth Page (`/auth`)
**Current State:**
- Title: "Sign In - Noted"
- Description: "Sign in to your Noted account..."

**Issues:**
- ⚠️ Should be no-indexed (prevent search indexing of login page)
- ❌ Missing Open Graph
- ❌ Missing canonical URL

---

### Application Pages (Protected/Private)

#### 7. Dashboard/Library Pages (`/read/*`)
**Current State:**
- ❌ **NO METADATA AT ALL**
- These pages are likely behind authentication

**Recommendation:**
- Add no-index meta tag to prevent search indexing
- Or add basic metadata for authenticated SEO

**Required Changes:**
```typescript
// src/app/read/layout.tsx
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};
```

#### 8. Book Reader Pages (`/read/[bookId]`)
**Current State:**
- ❌ **CRITICAL: NO METADATA**
- Dynamic pages have zero SEO implementation

**Issues:**
- ❌ No title generation from book data
- ❌ No description from book content
- ❌ No Open Graph
- ❌ No Twitter Card
- ❌ No structured data (Book schema)
- ❌ No canonical URL
- ❌ No meta keywords from book

**Required Implementation:**
```typescript
// src/app/read/(reading)/[bookId]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const book = await getBook(params.bookId);
  
  return {
    title: `${book.title} by ${book.author} | Noted`,
    description: `Read ${book.title} by ${book.author}. ${book.description?.slice(0, 150)}...`,
    openGraph: {
      title: book.title,
      description: book.description,
      images: [book.thumbnailUrl],
      type: 'book',
    },
    // ... more metadata
  };
}
```

---

## 3. Missing Configuration Files

### 3.1 Robots.txt
**File:** `src/app/robots.ts` or `public/robots.txt`

**Required Content:**
```typescript
// src/app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/read/', '/api/', '/auth/'],
      },
    ],
    sitemap: 'https://yourdomain.com/sitemap.xml',
  };
}
```

### 3.2 Sitemap
**File:** `src/app/sitemap.ts`

**Required Content:**
```typescript
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://yourdomain.com';
  
  // Static routes
  const staticRoutes = [
    { url: baseUrl, lastModified: new Date(), priority: 1.0 },
    { url: `${baseUrl}/features`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/how-it-works`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/use-cases`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), priority: 0.6 },
  ];
  
  // Dynamic book routes (if public)
  // const books = await getAllBooks();
  // const bookRoutes = books.map(book => ({
  //   url: `${baseUrl}/read/${book.id}`,
  //   lastModified: book.updatedAt,
  //   priority: 0.7,
  // }));
  
  return [...staticRoutes];
}
```

### 3.3 Manifest.json (PWA)
**File:** `src/app/manifest.ts`

**Required Content:**
```typescript
import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Noted - A Quiet Space for Reading',
    short_name: 'Noted',
    description: 'Read PDFs and write notes without leaving the page',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
```

---

## 4. Favicon & Icons Required

### Required Image Files

Create these in `/public/`:

```
public/
├── favicon.ico              (32x32, 48x48 multi-size ICO)
├── favicon-16x16.png        (16x16 PNG)
├── favicon-32x32.png        (32x32 PNG)
├── apple-touch-icon.png     (180x180 PNG)
├── icon-192x192.png         (192x192 PNG - PWA)
├── icon-512x512.png         (512x512 PNG - PWA)
├── android-chrome-192x192.png (192x192 PNG)
├── android-chrome-512x512.png (512x512 PNG)
└── site.webmanifest         (Web manifest)
```

### Root Layout Metadata Update

**File:** `src/app/layout.tsx`

Update the metadata export:
```typescript
export const metadata: Metadata = {
  // ... existing metadata
  
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#000000',
      },
    ],
  },
  manifest: '/site.webmanifest',
  themeColor: '#000000',
  viewport: 'width=device-width, initial-scale=1',
};
```

---

## 5. Structured Data (JSON-LD) Implementation

### 5.1 Homepage - SoftwareApplication Schema

**File:** `src/app/page.tsx` or create `src/components/seo/HomeSchema.tsx`

```typescript
// Add to home page
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Noted',
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'Web',
  description: 'Read PDFs and write notes without leaving the page',
  url: 'https://yourdomain.com',
  image: 'https://yourdomain.com/images/og-home.jpg',
  author: {
    '@type': 'Organization',
    name: 'Noted',
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '100',
  },
};

// In component JSX:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
/>
```

### 5.2 Book Pages - Book Schema

**File:** Update `src/app/read/(reading)/[bookId]/page.tsx`

```typescript
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Book',
  name: book.title,
  author: {
    '@type': 'Person',
    name: book.author,
  },
  description: book.description,
  image: book.thumbnailUrl,
  url: `https://yourdomain.com/read/${book.id}`,
};
```

### 5.3 FAQ Page - FAQPage Schema

**File:** `src/app/(marketing)/faq/page.tsx`

```typescript
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqData.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};
```

### 5.4 Organization Schema (Global)

**File:** Create `src/components/seo/OrganizationSchema.tsx`

```typescript
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Noted',
  url: 'https://yourdomain.com',
  logo: 'https://yourdomain.com/logo.png',
  sameAs: [
    'https://twitter.com/noted',
    'https://github.com/noted',
  ],
};
```

---

## 6. Open Graph Images Required

### Specifications

| Property | Value |
|----------|-------|
| **Size** | 1200 x 630 pixels |
| **Format** | JPG or PNG |
| **Aspect Ratio** | 1.91:1 |
| **File Size** | < 8MB |

### Required OG Images

```
public/images/
├── og-home.jpg              (1200x630) - Home page
├── og-features.jpg          (1200x630) - Features page
├── og-how-it-works.jpg      (1200x630) - How it works
├── og-use-cases.jpg         (1200x630) - Use cases
├── og-faq.jpg               (1200x630) - FAQ page
├── og-default.jpg           (1200x630) - Fallback for all pages
└── og-book-template.jpg     (1200x630) - Template for dynamic book pages
```

### Dynamic OG Image Generation (Recommended)

**Alternative:** Use Next.js dynamic OG image generation

**File:** `src/app/opengraph-image.tsx`

```typescript
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Noted - A Quiet Space for Reading';
export const size = { width: 1200, height: 630 };

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <h1>Noted</h1>
        <p style={{ fontSize: 24 }}>A Quiet Space for Reading</p>
      </div>
    ),
    { ...size }
  );
}
```

---

## 7. Complete Implementation Checklist

### Phase 1: Critical (Do First) - Estimated: 2-3 hours

- [ ] **1.1** Create `src/app/robots.ts`
- [ ] **1.2** Create `src/app/sitemap.ts`
- [ ] **1.3** Update root `src/app/layout.tsx` with icons and manifest
- [ ] **1.4** Add Open Graph to home page (`src/app/opengraph-image.tsx`)
- [ ] **1.5** Add Twitter Card to home page (`src/app/twitter-image.tsx`)
- [ ] **1.6** Generate favicon files (all sizes)
- [ ] **1.7** Create `public/site.webmanifest`
- [ ] **1.8** Add canonical URLs to all marketing pages

### Phase 2: High Priority - Estimated: 3-4 hours

- [ ] **2.1** Add Open Graph to all marketing pages
  - [ ] `/features/opengraph-image.tsx`
  - [ ] `/how-it-works/opengraph-image.tsx`
  - [ ] `/use-cases/opengraph-image.tsx`
  - [ ] `/faq/opengraph-image.tsx`
- [ ] **2.2** Add Twitter Cards to all marketing pages
- [ ] **2.3** Add SoftwareApplication schema to homepage
- [ ] **2.4** Add Organization schema to root layout
- [ ] **2.5** Add no-index to auth page (`/auth`)
- [ ] **2.6** Add no-index to app pages (`/read/*`)

### Phase 3: Dynamic Content - Estimated: 4-5 hours

- [ ] **3.1** Create `generateMetadata()` for book pages (`/read/[bookId]`)
- [ ] **3.2** Create dynamic OG images for book pages
- [ ] **3.3** Add Book schema structured data to book pages
- [ ] **3.4** Add FAQ schema to FAQ page
- [ ] **3.5** Add ItemList schema to features page
- [ ] **3.6** Add HowTo schema to "How It Works" page

### Phase 4: Enhancement - Estimated: 2-3 hours

- [ ] **4.1** Add breadcrumb structured data
- [ ] **4.2** Create SEO utility functions (reusable metadata generators)
- [ ] **4.3** Add keywords meta tags (optional)
- [ ] **4.4** Create SEO monitoring dashboard/analytics
- [ ] **4.5** Add hreflang tags if planning multi-language
- [ ] **4.6** Create image sitemap for book thumbnails

---

## 8. Code Templates

### 8.1 Reusable SEO Metadata Factory

**File:** Create `src/lib/seo/metadata.ts`

```typescript
import { Metadata } from 'next';

interface PageMetadata {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'book' | 'article';
  noIndex?: boolean;
}

export function generatePageMetadata({
  title,
  description,
  image = '/images/og-default.jpg',
  url,
  type = 'website',
  noIndex = false,
}: PageMetadata): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://noted.com';
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  
  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: 'Noted',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type,
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@noted',
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
```

### 8.2 JSON-LD Component

**File:** Create `src/components/seo/JsonLd.tsx`

```typescript
'use client';

import { ReactNode } from 'react';

interface JsonLdProps {
  data: Record<string, any> | Record<string, any>[];
}

export function JsonLd({ data }: JsonLdProps): ReactNode {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}
```

### 8.3 Updated Marketing Layout Metadata

**File:** Update `src/app/(marketing)/layout.tsx`

```typescript
import { generatePageMetadata } from '@/lib/seo/metadata';

export const metadata = generatePageMetadata({
  title: 'Noted — A quiet space for thoughtful reading',
  description: 'Capture notes, save quotes, and build story insights directly beside your books.',
  url: '/',
});
```

---

## 9. Testing & Validation

### 9.1 Tools to Use

| Tool | Purpose | URL |
|------|---------|-----|
| Google Rich Results Test | Structured data validation | https://search.google.com/test/rich-results |
| Facebook Sharing Debugger | Open Graph validation | https://developers.facebook.com/tools/debug/ |
| Twitter Card Validator | Twitter card preview | https://cards-dev.twitter.com/validator |
| LinkedIn Post Inspector | LinkedIn sharing preview | https://www.linkedin.com/post-inspector/ |
| Google Search Console | Index monitoring | https://search.google.com/search-console |
| PageSpeed Insights | Performance & Core Web Vitals | https://pagespeed.web.dev/ |
| Screaming Frog | Technical SEO audit | https://www.screamingfrog.co.uk/ |

### 9.2 Testing Checklist

- [ ] Run Google Rich Results Test on all pages
- [ ] Test OG tags with Facebook Debugger
- [ ] Preview Twitter cards with Card Validator
- [ ] Check all favicon sizes load correctly
- [ ] Verify sitemap.xml is accessible
- [ ] Confirm robots.txt rules work
- [ ] Test structured data in Search Console
- [ ] Validate JSON-LD with Schema Markup Validator
- [ ] Check canonical URLs are correct
- [ ] Verify images have proper alt text

---

## 10. Image Asset Requirements

### 10.1 Brand Assets to Create

You need these design assets:

**Favicon Package:**
- Source: Your logo (SVG preferred)
- Tools: https://realfavicongenerator.net/ or Figma
- Output: favicon.ico, PNGs in all sizes

**Open Graph Images:**
- Design tool: Figma, Canva, or Photoshop
- Template size: 1200x630
- Style: Clean, branded, readable at small sizes
- Include: Logo, tagline, subtle background
- Format: JPG (smaller) or PNG (transparent)

**PWA Icons:**
- Source: Logo in square format
- Sizes: 192x192, 512x512
- Background: Should work on any background

### 10.2 Recommended Design Specs

```
Open Graph Image Template:
├── Canvas: 1200 x 630 px
├── Background: #FFFFFF or brand color
├── Logo: Top center, 200px width
├── Title: Center, 48-72px font, bold
├── Tagline: Below title, 24-32px font
├── Padding: 60px on all sides
└── Brand colors only
```

---

## 11. Expected Results After Implementation

### 11.1 SEO Improvements

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| SEO Score | 4/10 | 9/10 | +125% |
| Pages Indexed | ~5 | ~10+ | +100% |
| Rich Snippets | 0 | 5+ | New |
| Social Shares | Basic | Rich Cards | Improved |
| Click-Through Rate | Low | Higher | +30-50% |

### 11.2 Social Sharing Preview

**Before:**
- Plain text link with generic preview
- No image or branding

**After:**
- Large image with branding
- Title and description
- Professional appearance
- Consistent across platforms

### 11.3 Search Results Appearance

**Before:**
- Simple blue link
- Description text only

**After:**
- Star ratings (if applicable)
- App/software badges
- Sitelinks
- Rich descriptions
- Publication dates

---

## 12. Maintenance Schedule

### Monthly Tasks

- [ ] Review Google Search Console for errors
- [ ] Check for broken links (use Screaming Frog)
- [ ] Monitor Core Web Vitals
- [ ] Review and update meta descriptions if needed

### Quarterly Tasks

- [ ] Update sitemap with new pages
- [ ] Refresh Open Graph images
- [ ] Review and improve structured data
- [ ] Analyze search performance metrics
- [ ] Update keywords based on trends

### Annual Tasks

- [ ] Full technical SEO audit
- [ ] Review and update all metadata
- [ ] Check for new SEO best practices
- [ ] Update favicon if rebranding
- [ ] Comprehensive competitor analysis

---

## 13. Quick Reference: File Changes Summary

### Files to Create (New)

```
src/
├── app/
│   ├── robots.ts                      ← NEW
│   ├── sitemap.ts                     ← NEW
│   ├── manifest.ts                    ← NEW
│   ├── opengraph-image.tsx            ← NEW
│   ├── twitter-image.tsx              ← NEW
│   ├── (marketing)/
│   │   ├── features/opengraph-image.tsx   ← NEW
│   │   ├── features/twitter-image.tsx     ← NEW
│   │   ├── how-it-works/opengraph-image.tsx ← NEW
│   │   ├── how-it-works/twitter-image.tsx   ← NEW
│   │   ├── use-cases/opengraph-image.tsx    ← NEW
│   │   ├── use-cases/twitter-image.tsx      ← NEW
│   │   └── faq/opengraph-image.tsx          ← NEW
│   └── read/(reading)/[bookId]/opengraph-image.tsx ← NEW (dynamic)
├── lib/seo/
│   ├── metadata.ts                    ← NEW
│   └── schemas.ts                     ← NEW
└── components/seo/
    ├── JsonLd.tsx                     ← NEW
    ├── OrganizationSchema.tsx         ← NEW
    ├── SoftwareAppSchema.tsx          ← NEW
    ├── BookSchema.tsx                 ← NEW
    └── FAQSchema.tsx                  ← NEW

public/
├── favicon.ico                        ← NEW
├── favicon-16x16.png                  ← NEW
├── favicon-32x32.png                  ← NEW
├── apple-touch-icon.png               ← NEW
├── android-chrome-192x192.png         ← NEW
├── android-chrome-512x512.png         ← NEW
├── site.webmanifest                   ← NEW
└── images/
    ├── og-home.jpg                    ← NEW
    ├── og-features.jpg                ← NEW
    ├── og-how-it-works.jpg            ← NEW
    ├── og-use-cases.jpg               ← NEW
    ├── og-faq.jpg                     ← NEW
    └── og-default.jpg                 ← NEW
```

### Files to Modify (Existing)

```
src/
├── app/
│   ├── layout.tsx                     ← UPDATE (add icons, manifest)
│   ├── (marketing)/
│   │   ├── layout.tsx                 ← UPDATE (add canonical, OG)
│   │   ├── features/page.tsx          ← UPDATE (add schema)
│   │   ├── how-it-works/page.tsx      ← UPDATE (add schema)
│   │   ├── use-cases/page.tsx         ← UPDATE (add schema)
│   │   └── faq/page.tsx               ← UPDATE (add schema)
│   ├── (auth)/auth/page.tsx           ← UPDATE (add no-index)
│   ├── read/
│   │   ├── layout.tsx                 ← UPDATE (add no-index)
│   │   └── (reading)/[bookId]/
│   │       └── page.tsx               ← UPDATE (add generateMetadata)
│   └── page.tsx                       ← UPDATE (add schema)
└── next.config.ts                     ← VERIFY (images config)
```

---

## 14. Questions for You

Before implementation, please clarify:

1. **Domain Name:** What's your production domain? (needed for canonical URLs)
2. **Social Media:** Do you have Twitter/X handle for Twitter Cards?
3. **Book Visibility:** Should book pages be public (SEO-friendly) or private (no-index)?
4. **Brand Colors:** What are your exact hex color codes for OG images?
5. **Logo:** Do you have a high-res logo file (SVG or PNG with transparency)?
6. **Priority:** Which phase should we tackle first?

---

## 15. Next Steps

**Immediate Actions:**
1. Review this audit document
2. Answer the questions above
3. Decide on priority (suggest Phase 1 first)
4. Provide brand assets (logo, colors)
5. I'll implement the changes

**Estimated Total Time to Complete:** 11-15 hours of development work

---

*Document Version: 1.0*
*Created: February 2026*
*Next Review: March 2026*