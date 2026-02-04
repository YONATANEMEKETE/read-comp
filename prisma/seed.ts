import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

const books = [
  {
    title: 'The Millionaire Next Door',
    author: 'Thomas J. Stanley, Ph.D. and William D. Danko, Ph.D.',
    thumbnailUrl:
      'https://4aemqjor6g.ufs.sh/f/Fpryp4YlG47cYFj4Kn3Lew36xTPUZmMN5kojiysXf9n1KHWh',
    pdfUrl:
      'https://4aemqjor6g.ufs.sh/f/Fpryp4YlG47cv3yjNAUSJN5ftD8xglTEwrbAXG7H6QIkFdsK', // Example public domain PDF
    totalPages: 270,
    isSuggested: true,
  },
  {
    title: 'The 5 Second Rule',
    author: 'Mel Robbins',
    thumbnailUrl:
      'https://4aemqjor6g.ufs.sh/f/Fpryp4YlG47cKG8f8FEYU9zxeJNPOVMt5uEKspvIX7Z04BRb',
    pdfUrl:
      'https://4aemqjor6g.ufs.sh/f/Fpryp4YlG47cT5Gt5V5o6mOUaZtlAqQTIyi3zdRBVN1eGhY8', // Example public domain PDF
    totalPages: 252,
    isSuggested: true,
  },
  {
    title: 'Zero to One',
    author: 'Peter Thiel',
    thumbnailUrl:
      'https://4aemqjor6g.ufs.sh/f/Fpryp4YlG47cynbAowaBlhkGCqNj79b0Mug3I5RoTU4XpeiQ',
    pdfUrl:
      'https://4aemqjor6g.ufs.sh/f/Fpryp4YlG47cfdhATlH0u8VelDAiqT5L3RZMtx16YpBPy92m', // Example public domain PDF
    totalPages: 186,
    isSuggested: true,
  },
  {
    title: 'The 100$ Startup',
    author: 'Chris Guillebeau',
    thumbnailUrl:
      'https://4aemqjor6g.ufs.sh/f/Fpryp4YlG47coIqyqmc6KWJmfQcLxbjzoBUq0kNsI54XhMHu',
    pdfUrl:
      'https://4aemqjor6g.ufs.sh/f/Fpryp4YlG47cNnY5Xufs7ze8FjpPUMQVTLakxHEvrAi6RCSX', // Example public domain PDF
    totalPages: 250,
    isSuggested: true,
  },
  {
    title: 'crushing It.',
    author: 'GARY VAYNERCHUK',
    thumbnailUrl:
      'https://4aemqjor6g.ufs.sh/f/Fpryp4YlG47cafBLJnPwtjXKfRueEHDTOlgsQZ4UdxW0PkFi',
    pdfUrl:
      'https://4aemqjor6g.ufs.sh/f/Fpryp4YlG47cOoIMHvtm1ITLsPkbGY8Fzt07eawSAXRlcJx4', // Example public domain PDF
    totalPages: 223,
    isSuggested: true,
  },
  {
    title: '100 Greate Business Ideas',
    author: 'Jeremy Kourdi',
    thumbnailUrl:
      'https://4aemqjor6g.ufs.sh/f/Fpryp4YlG47c4UvklQdDyeIvTCPL3jF2KYNXimUhHuQ8AxEa',
    pdfUrl:
      'https://4aemqjor6g.ufs.sh/f/Fpryp4YlG47c4UvklQdDyeIvTCPL3jF2KYNXimUhHuQ8AxEa', // Example public domain PDF
    totalPages: 241,
    isSuggested: true,
  },
  {
    title: 'Rich Dad poor Dad.',
    author: 'Robert T. Kiyosaki',
    thumbnailUrl:
      'https://4aemqjor6g.ufs.sh/f/Fpryp4YlG47ceiP5Rj6ZxvlW3tbKSmAdufYHEFiX71INBkMa',
    pdfUrl:
      'https://4aemqjor6g.ufs.sh/f/Fpryp4YlG47cihh3K4D3Mjyrt0XOg4KZ1hfCHYJBWGV76Flx', // Example public domain PDF
    totalPages: 241,
    isSuggested: true,
  },
  {
    title: 'the richest man in Babylon.',
    author: 'George S. Clason',
    thumbnailUrl:
      'https://4aemqjor6g.ufs.sh/f/Fpryp4YlG47cF6nFDeYlG47cByDXwRWkeHKCAEQ2oPMrjhIt',
    pdfUrl:
      'https://4aemqjor6g.ufs.sh/f/Fpryp4YlG47cYAWWXa3Lew36xTPUZmMN5kojiysXf9n1KHWh', // Example public domain PDF
    totalPages: 122,
    isSuggested: true,
  },
  {
    title: 'One + One = Three.',
    author: 'DAVE TROTT',
    thumbnailUrl:
      'https://4aemqjor6g.ufs.sh/f/Fpryp4YlG47cp9i1O6bTAIoyc1REqQj0SJaG6KFiDVkgdXZ3',
    pdfUrl:
      'https://4aemqjor6g.ufs.sh/f/Fpryp4YlG47chETw9FQ8YpTxQo4F7B5k8zeqnLhNCWyXdPim', // Example public domain PDF
    totalPages: 152,
    isSuggested: true,
  },
  {
    title: 'How to win friends and Influence People.',
    author: 'Dale Carnegie',
    thumbnailUrl:
      'https://4aemqjor6g.ufs.sh/f/Fpryp4YlG47co7I6Rvc6KWJmfQcLxbjzoBUq0kNsI54XhMHu',
    pdfUrl:
      'https://4aemqjor6g.ufs.sh/f/Fpryp4YlG47chYLeHI8YpTxQo4F7B5k8zeqnLhNCWyXdPimu', // Example public domain PDF
    totalPages: 215,
    isSuggested: true,
  },
  {
    title: 'Give and Take.',
    author: 'ADAM GRANT',
    thumbnailUrl:
      'https://4aemqjor6g.ufs.sh/f/Fpryp4YlG47cV32LmXktkCHfwPGr8mAXzLOTBpeqZ092aYdh',
    pdfUrl:
      'https://4aemqjor6g.ufs.sh/f/Fpryp4YlG47cv5WKz0USJN5ftD8xglTEwrbAXG7H6QIkFdsK', // Example public domain PDF
    totalPages: 260,
    isSuggested: true,
  },
  {
    title: 'Made to Stick.',
    author: 'Chip Heath & Dan Heath',
    thumbnailUrl:
      'https://4aemqjor6g.ufs.sh/f/Fpryp4YlG47cE8cS1wpdZF9HITzYJ8AXeSbQmPrkxh2vV1R0',
    pdfUrl:
      'https://4aemqjor6g.ufs.sh/f/Fpryp4YlG47cT5cYSUFo6mOUaZtlAqQTIyi3zdRBVN1eGhY8', // Example public domain PDF
    totalPages: 225,
    isSuggested: true,
  },
  {
    title: 'How to win friends and Influence People.',
    author: 'Dale Carnegie',
    thumbnailUrl:
      'https://4aemqjor6g.ufs.sh/f/Fpryp4YlG47co7I6Rvc6KWJmfQcLxbjzoBUq0kNsI54XhMHu',
    pdfUrl:
      'https://4aemqjor6g.ufs.sh/f/Fpryp4YlG47chYLeHI8YpTxQo4F7B5k8zeqnLhNCWyXdPimu', // Example public domain PDF
    totalPages: 215,
    isSuggested: true,
  },
  {
    title: 'Rewire Your Brain.',
    author: 'John B. Arden, Ph.D.',
    thumbnailUrl:
      'https://4aemqjor6g.ufs.sh/f/Fpryp4YlG47cHmGd64nrw9QeTby0kG6hcU7EtZHVA8B1jd5o',
    pdfUrl:
      'https://4aemqjor6g.ufs.sh/f/Fpryp4YlG47c2NpCB6yAFqRbnft15v9IypwzN2axsXWHYkS4', // Example public domain PDF
    totalPages: 256,
    isSuggested: true,
  },
  {
    title: 'getting things Done.',
    author: 'David Allen',
    thumbnailUrl:
      'https://4aemqjor6g.ufs.sh/f/Fpryp4YlG47cT5VV3xGo6mOUaZtlAqQTIyi3zdRBVN1eGhY8',
    pdfUrl:
      'https://4aemqjor6g.ufs.sh/f/Fpryp4YlG47c5CmJxdAOrfDW6SCJbM0UzXaLGnv1gIYdA5k9', // Example public domain PDF
    totalPages: 358,
    isSuggested: true,
  },
  {
    title: 'Secrets of the millionaire Mind.',
    author: 'T. Harv Eker',
    thumbnailUrl:
      'https://4aemqjor6g.ufs.sh/f/Fpryp4YlG47c5pLo8vAOrfDW6SCJbM0UzXaLGnv1gIYdA5k9',
    pdfUrl:
      'https://4aemqjor6g.ufs.sh/f/Fpryp4YlG47cRvbIpAztHvdlAqepnQNr12fuLSohBGaMZPEk', // Example public domain PDF
    totalPages: 200,
    isSuggested: true,
  },
  {
    title: 'Start with Why.',
    author: 'SIMON SINEK',
    thumbnailUrl:
      'https://4aemqjor6g.ufs.sh/f/Fpryp4YlG47cvPStt2USJN5ftD8xglTEwrbAXG7H6QIkFdsK',
    pdfUrl:
      'https://4aemqjor6g.ufs.sh/f/Fpryp4YlG47ca5ZYbGPwtjXKfRueEHDTOlgsQZ4UdxW0PkFi', // Example public domain PDF
    totalPages: 271,
    isSuggested: true,
  },
  {
    title: 'Think like an Enterpreneur.',
    author: 'BEVERLY E. JONES',
    thumbnailUrl:
      'https://4aemqjor6g.ufs.sh/f/Fpryp4YlG47cGy2RbchS2PnLNzmUyhMqkeEpAObtDguv1ifH',
    pdfUrl:
      'https://4aemqjor6g.ufs.sh/f/Fpryp4YlG47conXPzPc6KWJmfQcLxbjzoBUq0kNsI54XhMHu', // Example public domain PDF
    totalPages: 225,
    isSuggested: true,
  },
  {
    title: 'The Compound Effect.',
    author: 'DARREN HARDY',
    thumbnailUrl:
      'https://4aemqjor6g.ufs.sh/f/Fpryp4YlG47cBHJK0JWRrYMU5OkXVWFjNCJxtlpHS47Bandq',
    pdfUrl:
      'https://4aemqjor6g.ufs.sh/f/Fpryp4YlG47c2k88j7yAFqRbnft15v9IypwzN2axsXWHYkS4', // Example public domain PDF
    totalPages: 195,
    isSuggested: true,
  },
  {
    title: 'The One Thing.',
    author: 'GARY KELLER',
    thumbnailUrl:
      'https://4aemqjor6g.ufs.sh/f/Fpryp4YlG47cOoFgkAYm1ITLsPkbGY8Fzt07eawSAXRlcJx4',
    pdfUrl:
      'https://4aemqjor6g.ufs.sh/f/Fpryp4YlG47cN5JoPSfs7ze8FjpPUMQVTLakxHEvrAi6RCSX', // Example public domain PDF
    totalPages: 243,
    isSuggested: true,
  },
];

async function main() {
  console.log('Start seeding...');

  // Optional: clear existing suggested books if you want to ensure no duplicates
  // await prisma.book.deleteMany({ where: { isSuggested: true } });

  const result = await prisma.book.createMany({
    data: books,
    skipDuplicates: true, // In case you run it multiple times
  });

  console.log(`Seeded ${result.count} books.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
