/*
  Warnings:

  - Added the required column `gender` to the `services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "services" ADD COLUMN     "gender" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "gender" TEXT NOT NULL;
