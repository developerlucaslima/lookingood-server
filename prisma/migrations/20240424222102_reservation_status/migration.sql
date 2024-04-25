/*
  Warnings:

  - The `status` column on the `reservations` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "reservations" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'WAITING_FOR_CONFIRMATION';
