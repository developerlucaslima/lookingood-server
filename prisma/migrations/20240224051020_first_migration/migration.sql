/*
  Warnings:

  - You are about to drop the column `establishmentId` on the `bookings` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_establishmentId_fkey";

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "establishmentId";
