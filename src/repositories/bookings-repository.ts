import { Booking, Prisma } from '@prisma/client'

export interface BookingsRepository {
  create(data: Prisma.BookingUncheckedCreateInput): Promise<Booking>
  findManyByUserId(userId: string): Promise<Booking[] | null>
  findManyByProfessionalAndDate(
    professionalId: string,
    date: Date,
  ): Promise<Booking[] | null>
  findByStartAndEndTime(startTime: Date, endTime: Date): Promise<Booking | null>
  // findByProfessionalAndDate
  // findByDate
  // findByProfessionalAndPeriod
  // findByPeriod
}
