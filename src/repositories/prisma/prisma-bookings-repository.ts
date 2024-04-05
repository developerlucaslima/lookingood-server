import { prisma } from '@/lib/prisma'
import { Booking, Prisma } from '@prisma/client'

import { BookingsRepository } from '../bookings-repository'
import { string } from 'zod'

export class PrismaBookingsRepository implements BookingsRepository {
  async create(data: Prisma.BookingUncheckedCreateInput) {
    const booking = await prisma.booking.create({
      data,
    })

    return booking
  }

  async findById(id: string) {
    const booking = await prisma.booking.findUnique({
      where: {
        id,
      },
    })

    return booking
  }

  async update(data: Prisma.BookingUncheckedCreateInput) {
    const booking = await prisma.booking.update({
      where: {
        id: data.id,
      },
      data,
    })

    return booking
  }

  async findManyByUserId(userId: string) {
    const booking = await prisma.booking.findMany({
      where: {
        userId,
      },
    })

    return booking
  }

  async findManyByStatus(status: string) {
    const booking = await prisma.booking.findMany({
      where: {
        status,
      },
    })

    return booking
  }

  async isBookingConflict(
    professionalId: string,
    startTime: Date,
    endTime: Date,
  ) {
    const booking = await prisma.booking.findMany({
      where: {
        status,
      },
    })

    return booking
  }
}
