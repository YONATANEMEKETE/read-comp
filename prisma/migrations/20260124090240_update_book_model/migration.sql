/*
  Warnings:

  - Made the column `author` on table `book` required. This step will fail if there are existing NULL values in that column.
  - Made the column `thumbnailUrl` on table `book` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "book" ALTER COLUMN "author" SET NOT NULL,
ALTER COLUMN "thumbnailUrl" SET NOT NULL;
