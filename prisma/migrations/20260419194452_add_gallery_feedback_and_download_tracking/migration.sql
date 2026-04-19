/*
  Warnings:

  - Added the required column `updatedAt` to the `Gallery` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Gallery" ADD COLUMN     "downloaded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "downloadedAt" TIMESTAMP(3),
ADD COLUMN     "rating" INTEGER,
ADD COLUMN     "review" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
