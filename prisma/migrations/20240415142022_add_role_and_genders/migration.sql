/*
  Warnings:

  - You are about to drop the column `Role` on the `establishments` table. All the data in the column will be lost.
  - You are about to drop the column `Role` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "establishments" DROP COLUMN "Role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'Establishment';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "Role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'User';
