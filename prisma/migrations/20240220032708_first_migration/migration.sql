/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `establishments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `establishments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_hash` to the `establishments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "establishments" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "password_hash" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "establishments_email_key" ON "establishments"("email");
