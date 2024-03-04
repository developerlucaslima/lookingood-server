/*
  Warnings:

  - You are about to drop the column `closingTime` on the `establishments` table. All the data in the column will be lost.
  - You are about to drop the column `openingTime` on the `establishments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "establishments" DROP COLUMN "closingTime",
DROP COLUMN "openingTime";

-- CreateTable
CREATE TABLE "schedules" (
    "id" TEXT NOT NULL,
    "MonOpeningTime" TEXT,
    "TueOpeningTime" TEXT,
    "WedOpeningTime" TEXT,
    "ThuOpeningTime" TEXT,
    "FriOpeningTime" TEXT,
    "SatOpeningTime" TEXT,
    "SunOpeningTime" TEXT,
    "MonClosingTime" TEXT,
    "TueClosingTime" TEXT,
    "WedClosingTime" TEXT,
    "ThuClosingTime" TEXT,
    "FriClosingTime" TEXT,
    "SatClosingTime" TEXT,
    "SunClosingTime" TEXT,
    "establishmentId" TEXT NOT NULL,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_establishmentId_fkey" FOREIGN KEY ("establishmentId") REFERENCES "establishments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
