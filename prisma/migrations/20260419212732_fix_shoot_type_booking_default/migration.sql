/*
  Warnings:

  - You are about to drop the column `price` on the `Event` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ShootType" AS ENUM ('INDIVIDUAL', 'COUPLE', 'GROUP', 'EVENT');

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "shootType" "ShootType" NOT NULL DEFAULT 'INDIVIDUAL';

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "price",
ADD COLUMN     "basePrice" INTEGER;

-- CreateTable
CREATE TABLE "EventPrice" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "shootType" "ShootType" NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "EventPrice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventPrice_eventId_shootType_key" ON "EventPrice"("eventId", "shootType");

-- AddForeignKey
ALTER TABLE "EventPrice" ADD CONSTRAINT "EventPrice_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
