/*
  Warnings:

  - You are about to drop the column `gender` on the `users` table. All the data in the column will be lost.
  - Added the required column `service_gender` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "gender",
ADD COLUMN     "service_gender" TEXT NOT NULL;
