import { Booking, Prisma } from '@prisma/client'

export interface BookingsRepository {
  create(data: Prisma.BookingUncheckedCreateInput): Promise<Booking>
  findManyByUserId(userId: string): Promise<Booking[] | null>
  isBookingConflict(
    professionalId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<boolean>
  // findByProfessionalAndDate
  // findByDate
  // findByProfessionalAndPeriod
  // findByPeriod
}
