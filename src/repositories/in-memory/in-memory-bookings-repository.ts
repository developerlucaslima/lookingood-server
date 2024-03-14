import { Booking, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { BookingsRepository } from '../bookings-repository'

export class InMemoryBookingsRepository implements BookingsRepository {
  public items: Booking[] = []

  async create(data: Prisma.BookingUncheckedCreateInput) {
    const booking = {
      id: randomUUID(),
      status: data.status,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
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

  async findManyByProfessionalAndDate(professionalId: string, date: Date) {
    const bookings = this.items.filter(
      (item) =>
        item.professionalId === professionalId &&
        item.startTime.toDateString().includes(date.toDateString()),
    )

    return bookings
  }

  async findByStartAndEndTime(startTime: Date, endTime: Date) {
    const conflict = this.items.find(
      (item) =>
        (item.endTime >= startTime && item.endTime <= endTime) ||
        (item.startTime >= startTime && item.startTime <= endTime),
    )

    // Se não houver conflitos, retorna null
    if (!conflict) {
      return null
    }

    // Se houver conflitos, retorna o serviço que está em conflito
    return conflict
  }
}
