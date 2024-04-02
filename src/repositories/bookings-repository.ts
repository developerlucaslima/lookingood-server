import { Booking, Prisma } from '@prisma/client'

export interface BookingsRepository {
  create(data: Prisma.BookingUncheckedCreateInput): Promise<Booking>
  update(booking: Booking): Promise<Booking>
  findManyByUserId(userId: string): Promise<Booking[] | null>
  isBookingConflict(
    professionalId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<boolean>
  findManyByStatus(status: string): Promise<Booking[] | null>
  findById(id: string): Promise<Booking | null>
}

// findByProfessionalAndDate
// findByDate
// findByProfessionalAndPeriod
// findByPeriod
