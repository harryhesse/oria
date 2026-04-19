/*
  Warnings:

  - A unique constraint covering the columns `[userId,eventId,shootType]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Booking_userId_eventId_key";

-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "shootType" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Booking_userId_eventId_shootType_key" ON "Booking"("userId", "eventId", "shootType");
