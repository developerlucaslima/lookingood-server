import { Prisma } from '@prisma/client'
import { prisma } from '@/prisma'
import { BookingsRepository } from '../bookings-repository'
import { InvalidTimetableError } from '@/use-cases/errors/invalid-timetable-error'

export class PrismaBookingsRepository implements BookingsRepository {
  async create(data: Prisma.BookingUncheckedCreateInput) {
    const booking = await prisma.$transaction(async (prisma) => {
      const isConflict = await this.isBookingConflict(
        data.professionalId,
        new Date(data.startTime),
        new Date(data.endTime),
      )
      if (isConflict) {
        throw new InvalidTimetableError()
      }

      return await prisma.booking.create({
        data,
      })
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
    const professionalBookings = await prisma.booking.findMany({
      where: {
        professionalId,
        OR: [
          {
            startTime: {
              lte: endTime,
              gte: startTime,
            },
          },
          {
            endTime: {
              lte: endTime,
              gte: startTime,
            },
          },
          {
            startTime: {
              lte: startTime,
            },
            endTime: {
              gte: endTime,
            },
          },
        ],
      },
    })

    return professionalBookings.length > 0
  }
}
