/*
  Warnings:

  - The `serviceGender` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `genderFor` on the `services` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Both', 'Male', 'Female');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('User', 'Establishment');

-- AlterTable
ALTER TABLE "establishments" ADD COLUMN     "Role" "Role" NOT NULL DEFAULT 'Establishment';

-- AlterTable
ALTER TABLE "services" DROP COLUMN "genderFor",
ADD COLUMN     "genderFor" "Gender" NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "Role" "Role" NOT NULL DEFAULT 'User',
DROP COLUMN "serviceGender",
ADD COLUMN     "serviceGender" "Gender" NOT NULL DEFAULT 'Both';
