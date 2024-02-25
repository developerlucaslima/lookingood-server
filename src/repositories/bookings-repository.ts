import { Booking, Prisma } from '@prisma/client'

export interface BookingsRepository {
  create(data: Prisma.BookingUncheckedCreateInput): Promise<Booking>
  findAllByUserId(userId: string): Promise<Booking | null>
}
