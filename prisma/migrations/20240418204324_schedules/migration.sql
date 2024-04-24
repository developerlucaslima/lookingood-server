/*
  Warnings:

  - You are about to drop the `schedules` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "schedules" DROP CONSTRAINT "schedules_establishmentId_fkey";

-- DropTable
DROP TABLE "schedules";

-- CreateTable
CREATE TABLE "establishmentSchedule" (
    "id" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "hoursWorking" INTEGER NOT NULL,
    "breakTime" TEXT,
    "hoursBreak" INTEGER,
    "establishmentId" TEXT NOT NULL,

    CONSTRAINT "establishmentSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professionalSchedule" (
    "id" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "hoursWorking" INTEGER NOT NULL,
    "breakTime" TEXT,
    "hoursBreak" INTEGER,
    "professionalId" TEXT NOT NULL,

    CONSTRAINT "professionalSchedule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "establishmentSchedule" ADD CONSTRAINT "establishmentSchedule_establishmentId_fkey" FOREIGN KEY ("establishmentId") REFERENCES "establishments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professionalSchedule" ADD CONSTRAINT "professionalSchedule_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "professionals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
