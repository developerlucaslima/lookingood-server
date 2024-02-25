/*
  Warnings:

  - You are about to drop the column `barberId` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the `barbers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `professionalId` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "barbers" DROP CONSTRAINT "barbers_establishmentId_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_barberId_fkey";

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "barberId",
ADD COLUMN     "professionalId" TEXT NOT NULL;

-- DropTable
DROP TABLE "barbers";

-- CreateTable
CREATE TABLE "professionals" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,
    "establishmentId" TEXT NOT NULL,

    CONSTRAINT "professionals_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "professionals" ADD CONSTRAINT "professionals_establishmentId_fkey" FOREIGN KEY ("establishmentId") REFERENCES "establishments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "professionals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
