-- DropForeignKey
ALTER TABLE "Gallery" DROP CONSTRAINT "Gallery_bookingId_fkey";

-- AlterTable
ALTER TABLE "Gallery" ALTER COLUMN "downloadUrl" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Gallery" ADD CONSTRAINT "Gallery_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
