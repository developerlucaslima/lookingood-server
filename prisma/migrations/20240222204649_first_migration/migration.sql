-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "barberId" TEXT;

-- CreateTable
CREATE TABLE "barbers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,
    "establishmentId" TEXT NOT NULL,

    CONSTRAINT "barbers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "barbers" ADD CONSTRAINT "barbers_establishmentId_fkey" FOREIGN KEY ("establishmentId") REFERENCES "establishments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "barbers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
