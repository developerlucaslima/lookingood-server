/*
  Warnings:

  - You are about to drop the column `hoursBreak` on the `establishmentSchedule` table. All the data in the column will be lost.
  - You are about to drop the column `hoursWorking` on the `establishmentSchedule` table. All the data in the column will be lost.
  - You are about to drop the column `hoursBreak` on the `professionalSchedule` table. All the data in the column will be lost.
  - You are about to drop the column `hoursWorking` on the `professionalSchedule` table. All the data in the column will be lost.
  - Added the required column `minutesWorking` to the `establishmentSchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minutesWorking` to the `professionalSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "establishmentSchedule" DROP COLUMN "hoursBreak",
DROP COLUMN "hoursWorking",
ADD COLUMN     "minutesBreak" INTEGER,
ADD COLUMN     "minutesWorking" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "professionalSchedule" DROP COLUMN "hoursBreak",
DROP COLUMN "hoursWorking",
ADD COLUMN     "minutesBreak" INTEGER,
ADD COLUMN     "minutesWorking" INTEGER NOT NULL;
