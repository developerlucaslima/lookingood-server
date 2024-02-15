/*
  Warnings:

  - You are about to drop the column `address` on the `establishments` table. All the data in the column will be lost.
  - Added the required column `latitude` to the `establishments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `establishments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "establishments" DROP COLUMN "address",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "latitude" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "longitude" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "phone" TEXT;
