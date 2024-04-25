import { Prisma, Status } from '@prisma/client'
import { prisma } from '@/prisma'
import { ReservationsRepository } from '../reservations-repository'
import { TimetableNotAvailableException } from '@/use-cases/errors/409-timetable-not-available-exception'

export class PrismaReservationsRepository implements ReservationsRepository {
  async create(data: Prisma.ReservationUncheckedCreateInput) {
    const reservation = await prisma.$transaction(async (prisma) => {
      const isConflict = await this.isReservationConflict(
        data.professionalId,
        new Date(data.startTime),
        new Date(data.endTime),
      )

      if (isConflict) {
        throw new TimetableNotAvailableException(
          data.startTime.toString(),
          data.endTime.toString(),
          'Transaction failed to create reservation.',
        )
      }

      return await prisma.reservation.create({
        data,
      })
    })

    return reservation
  }

  async findById(id: string) {
    const reservation = await prisma.reservation.findUnique({
      where: {
        id,
      },
    })

    return reservation
  }

  async update(data: Prisma.ReservationUncheckedCreateInput) {
    const reservation = await prisma.reservation.update({
      where: {
        id: data.id,
      },
      data,
    })

    return reservation
  }

  async findManyByUserId(userId: string) {
    const reservation = await prisma.reservation.findMany({
      where: {
        userId,
      },
    })

    return reservation
  }

  async findManyByStatus(status: Status) {
    const reservation = await prisma.reservation.findMany({
      where: {
        status,
      },
    })

    return reservation
  }

  async isReservationConflict(
    professionalId: string,
    startTime: Date,
    endTime: Date,
  ) {
    const professionalReservations = await prisma.reservation.findMany({
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

    return professionalReservations.length > 0
  }
}
