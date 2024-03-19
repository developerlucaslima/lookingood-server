import { Booking, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { BookingsRepository } from '../bookings-repository'

export class InMemoryBookingsRepository implements BookingsRepository {
  public items: Booking[] = []

  async create(data: Prisma.BookingUncheckedCreateInput) {
    const booking = {
      id: randomUUID(),
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      status: data.status,
      userId: data.userId,
      serviceId: data.serviceId,
      professionalId: data.professionalId,
    }

    this.items.push(booking)

    return booking
  }

  async findManyByUserId(userId: string) {
    const bookings = this.items.filter((item) => item.userId === userId)

    if (!bookings) {
      return null
    }

    return bookings
  }

  async isBookingConflict(
    professionalId: string,
    startTime: Date,
    endTime: Date,
  ) {
    const professionalBookings = this.items.filter(
      (item) => item.professionalId === professionalId,
    )

    const conflicts = professionalBookings.some((item) => {
      const itemStartTime = new Date(item.startTime)
      const itemEndTime = new Date(item.endTime)

      return (
        (startTime >= itemStartTime && startTime < itemEndTime) ||
        (endTime > itemStartTime && endTime <= itemEndTime) ||
        (startTime <= itemStartTime && endTime >= itemEndTime)
      )
    })

    return conflicts
  }
}
