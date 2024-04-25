import { prisma } from '@/prisma'
import { $Enums, Prisma } from '@prisma/client'
import { EstablishmentsSchedulesRepository } from '../establishments-schedules-repository'

export class PrismaEstablishmentsSchedulesRepository
  implements EstablishmentsSchedulesRepository
{
  async create(data: Prisma.EstablishmentScheduleUncheckedCreateInput) {
    const schedule = await prisma.establishmentSchedule.create({
      data,
    })

    return schedule
  }

  async findManyByEstablishmentId(establishmentId: string) {
    const schedule = await prisma.establishmentSchedule.findMany({
      where: {
        establishmentId,
      },
    })

    return schedule
  }

  async findByEstablishmentIdAndWeekDay(
    establishmentId: string,
    weekDay: $Enums.WeekDay,
  ) {
    const schedule = await prisma.establishmentSchedule.findFirst({
      where: {
        establishmentId,
        weekDay,
      },
    })

    return schedule
  }
}
