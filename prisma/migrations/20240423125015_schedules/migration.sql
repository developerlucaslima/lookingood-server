/*
  Warnings:

  - The values [Both,Male,Female] on the enum `Gender` will be removed. If these variants are still used in the database, this will fail.
  - The values [User,Establishment] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `weekDay` to the `establishmentSchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weekDay` to the `professionalSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WeekDay" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- AlterEnum
BEGIN;
CREATE TYPE "Gender_new" AS ENUM ('BOTH', 'MALE', 'FEMALE');
ALTER TABLE "users" ALTER COLUMN "serviceGender" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "serviceGender" TYPE "Gender_new" USING ("serviceGender"::text::"Gender_new");
ALTER TABLE "services" ALTER COLUMN "genderFor" TYPE "Gender_new" USING ("genderFor"::text::"Gender_new");
ALTER TYPE "Gender" RENAME TO "Gender_old";
ALTER TYPE "Gender_new" RENAME TO "Gender";
DROP TYPE "Gender_old";
ALTER TABLE "users" ALTER COLUMN "serviceGender" SET DEFAULT 'BOTH';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('USER', 'ESTABLISHMENT');
ALTER TABLE "establishments" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TABLE "establishments" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "establishments" ALTER COLUMN "role" SET DEFAULT 'ESTABLISHMENT';
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- AlterTable
ALTER TABLE "establishmentSchedule" ADD COLUMN     "weekDay" "WeekDay" NOT NULL;

-- AlterTable
ALTER TABLE "establishments" ALTER COLUMN "role" SET DEFAULT 'ESTABLISHMENT';

-- AlterTable
ALTER TABLE "professionalSchedule" ADD COLUMN     "weekDay" "WeekDay" NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "serviceGender" SET DEFAULT 'BOTH',
ALTER COLUMN "role" SET DEFAULT 'USER';
