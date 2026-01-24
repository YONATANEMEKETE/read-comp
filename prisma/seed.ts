import { PrismaClient, ReadingStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

// Simple password hashing function (in production, use bcrypt or similar)
async function hashPassword(password: string): Promise<string> {
  // For better-auth, we need to use their hashing
  // For now, we'll use a simple approach - better-auth will handle this
  const crypto = await import('crypto');
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
  console.log('🌱 Starting database seed...');

  // Create a test user (or use existing user ID)
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
      emailVerified: true,
    },
  });

  console.log('✅ Test user created:', testUser.email);

  // Create account with password for email/password login
  const hashedPassword = await hashPassword('password123');

  await prisma.account.upsert({
    where: {
      id: 'test-account-id',
    },
    update: {
      password: hashedPassword,
    },
    create: {
      id: 'test-account-id',
      accountId: testUser.id,
      providerId: 'credential',
      userId: testUser.id,
      password: hashedPassword,
    },
  });

  console.log('✅ Test account created with password: password123');

  // Books data with realistic information
  const booksData = [
    // USER'S BOOKS (not suggested)
    {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80',
      pdfUrl: '/books/great-gatsby.pdf',
      isSuggested: false,
      status: ReadingStatus.READING,
      isFavorite: true,
      progressPage: 45,
    },
    {
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80',
      pdfUrl: '/books/mockingbird.pdf',
      isSuggested: false,
      status: ReadingStatus.FINISHED,
      isFavorite: true,
      progressPage: 281,
    },
    {
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1621351123023-73f0f3bc30e3?w=400&q=80',
      pdfUrl: '/books/hobbit.pdf',
      isSuggested: false,
      status: ReadingStatus.FINISHED,
      isFavorite: false,
      progressPage: 310,
    },
    {
      title: 'Brave New World',
      author: 'Aldous Huxley',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&q=80',
      pdfUrl: '/books/brave-new-world.pdf',
      isSuggested: false,
      status: ReadingStatus.NEW,
      isFavorite: false,
      progressPage: 1,
    },
    {
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80',
      pdfUrl: '/books/pride-prejudice.pdf',
      isSuggested: false,
      status: ReadingStatus.READING,
      isFavorite: false,
      progressPage: 120,
    },
    {
      title: 'The Catcher in the Rye',
      author: 'J.D. Salinger',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80',
      pdfUrl: '/books/catcher-rye.pdf',
      isSuggested: false,
      status: ReadingStatus.NEW,
      isFavorite: false,
      progressPage: 1,
    },

    // SUGGESTED BOOKS (recommendations)
    {
      title: '1984',
      author: 'George Orwell',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
      pdfUrl: '/books/1984.pdf',
      isSuggested: true,
    },
    {
      title: 'Atomic Habits',
      author: 'James Clear',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&q=80',
      pdfUrl: '/books/atomic-habits.pdf',
      isSuggested: true,
    },
    {
      title: 'Deep Work',
      author: 'Cal Newport',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1512428559083-a4979b2b51ff?w=400&q=80',
      pdfUrl: '/books/deep-work.pdf',
      isSuggested: true,
    },
    {
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&q=80',
      pdfUrl: '/books/sapiens.pdf',
      isSuggested: true,
    },
    {
      title: 'The Alchemist',
      author: 'Paulo Coelho',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80',
      pdfUrl: '/books/alchemist.pdf',
      isSuggested: true,
    },
    {
      title: 'Thinking, Fast and Slow',
      author: 'Daniel Kahneman',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&q=80',
      pdfUrl: '/books/thinking-fast-slow.pdf',
      isSuggested: true,
    },
    {
      title: 'The Power of Now',
      author: 'Eckhart Tolle',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400&q=80',
      pdfUrl: '/books/power-of-now.pdf',
      isSuggested: true,
    },
    {
      title: 'Educated',
      author: 'Tara Westover',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&q=80',
      pdfUrl: '/books/educated.pdf',
      isSuggested: true,
    },
  ];

  console.log('📚 Creating books...');

  for (const bookData of booksData) {
    const { status, isFavorite, progressPage, ...bookInfo } = bookData;

    // Create the book
    const book = await prisma.book.upsert({
      where: {
        id: `book-${bookInfo.title.toLowerCase().replace(/\s+/g, '-')}`,
      },
      update: bookInfo,
      create: {
        id: `book-${bookInfo.title.toLowerCase().replace(/\s+/g, '-')}`,
        ...bookInfo,
      },
    });

    console.log(`  ✓ Created: ${book.title}`);

    // If it's a user's book (not suggested), create UserBook entry
    if (!bookInfo.isSuggested && status) {
      await prisma.userBook.upsert({
        where: {
          userId_bookId: {
            userId: testUser.id,
            bookId: book.id,
          },
        },
        update: {
          status,
          isFavorite: isFavorite || false,
          progressPage: progressPage || 1,
        },
        create: {
          userId: testUser.id,
          bookId: book.id,
          status,
          isFavorite: isFavorite || false,
          progressPage: progressPage || 1,
        },
      });

      console.log(`    → Added to user's library (${status})`);
    }
  }

  console.log('\n✨ Seed completed successfully!');
  console.log(`📊 Summary:`);
  console.log(`   - Total books: ${booksData.length}`);
  console.log(
    `   - User's books: ${booksData.filter((b) => !b.isSuggested).length}`,
  );
  console.log(
    `   - Suggested books: ${booksData.filter((b) => b.isSuggested).length}`,
  );
  console.log(
    `   - Reading: ${booksData.filter((b) => b.status === ReadingStatus.READING).length}`,
  );
  console.log(
    `   - Finished: ${booksData.filter((b) => b.status === ReadingStatus.FINISHED).length}`,
  );
  console.log(
    `   - On Shelf (NEW): ${booksData.filter((b) => b.status === ReadingStatus.NEW).length}`,
  );
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
