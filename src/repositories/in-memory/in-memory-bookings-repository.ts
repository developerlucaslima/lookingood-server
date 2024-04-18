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
      establishmentId: data.establishmentId,
    }

    this.items.push(booking)

    return booking
  }

  async update(booking: Booking) {
    const bookingIndex = this.items.findIndex((item) => item.id === booking.id)

    if (bookingIndex >= 0) {
      this.items[bookingIndex] = booking
    }

    return booking
  }

  async findManyByUserId(userId: string) {
    const bookings = this.items.filter((item) => item.userId === userId)

    if (!bookings) {
      return null
    }

    return bookings
  }

  // write skew + double booking https://medium.com/@pulkitent/system-design-database-transactions-isolation-levels-concurrency-control-contd-part-2-78db036f6971
  // Designing Data Intensive Applications

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

  async findManyByStatus(status: string) {
    const bookings = this.items.filter((item) => item.status === status)

    if (!bookings) {
      return null
    }

    return bookings
  }

  async findById(id: string) {
    const booking = this.items.find((item) => item.id === id)

    if (!booking) {
      return null
    }

    return booking
  }
}
