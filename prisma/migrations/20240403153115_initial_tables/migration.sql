/*
  Warnings:

  - Added the required column `modificationDeadlineMinutes` to the `services` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "services" ADD COLUMN     "modificationDeadlineMinutes" INTEGER NOT NULL;
