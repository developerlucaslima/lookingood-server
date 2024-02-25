import { Booking, Prisma } from '@prisma/client'
// import dayjs from 'dayjs'
import { randomUUID } from 'node:crypto'
import { BookingsRepository } from '../bookings-repository'

export class InMemoryBookingsRepository implements BookingsRepository {
  public items: Booking[] = []

  async findAllByUserId(userId: string) {
    const booking = this.items.find((item) => item.userId === userId)

    if (!booking) {
      return null
    }

    return booking
  }

  async create(data: Prisma.BookingUncheckedCreateInput) {
    const booking = {
      id: randomUUID(),
      date: new Date(),
      status: data.status,
      userId: data.userId,
      serviceId: data.serviceId,
      professionalId: data.professionalId,
    }

    this.items.push(booking)

    return booking
  }
}
