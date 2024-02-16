-- AlterTable
ALTER TABLE "services" ADD COLUMN     "imageUrl" TEXT,
ALTER COLUMN "description" DROP NOT NULL;
