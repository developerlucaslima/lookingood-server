import { Booking, Prisma, Status } from '@prisma/client'
import { randomUUID } from 'crypto'

import { BookingsRepository } from '../bookings-repository'

export class InMemoryBookingsRepository implements BookingsRepository {
  public items: Map<Booking['id'], Booking> = new Map()

  async create(data: Prisma.BookingUncheckedCreateInput) {
    const booking: Booking = {
      id: randomUUID(),
      status: data.status as Status,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      professionalId: data.professionalId,
      serviceId: data.serviceId,
      userId: data.userId,
      establishmentId: data.establishmentId,
    }
    this.items.set(booking.id, booking)

    return booking
  }

  async update(booking: Booking) {
    if (this.items.has(booking.id)) {
      this.items.set(booking.id, booking)
    }

    return booking
  }

  async findManyByUserId(userId: string) {
    const bookings: Booking[] = []
    for (const booking of this.items.values()) {
      if (booking.userId === userId) {
        bookings.push(booking)
      }
    }

    return bookings
  }

  async isBookingConflict(
    professionalId: string,
    startTime: Date,
    endTime: Date,
  ) {
    let conflict = false
    for (const booking of this.items.values()) {
      const isSameProfessional = booking.professionalId === professionalId
      const isStartTimeOverlap =
        startTime >= booking.startTime && startTime < booking.endTime
      const isEndTimeOverlap =
        endTime > booking.startTime && endTime <= booking.endTime
      const isIntervalOverlap =
        startTime <= booking.startTime && endTime >= booking.endTime
      if (
        isSameProfessional &&
        (isStartTimeOverlap || isEndTimeOverlap || isIntervalOverlap)
      ) {
        conflict = true
      }
    }

    return conflict
  }

  async findManyByStatus(status: string) {
    const bookings: Booking[] = []
    for (const booking of this.items.values()) {
      if (booking.status === status) {
        bookings.push(booking)
      }
    }
    return bookings
  }

  async findById(id: string) {
    return this.items.get(id) || null
  }
}
