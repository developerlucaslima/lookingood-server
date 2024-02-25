/*
  Warnings:

  - Made the column `barberId` on table `bookings` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_barberId_fkey";

-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "barberId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "barbers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
