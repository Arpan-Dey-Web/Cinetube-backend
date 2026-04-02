/*
  Warnings:

  - You are about to drop the column `tmdbId` on the `Movie` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Movie_tmdbId_key";

-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "tmdbId";
