import { prisma } from '@/prisma'
import { $Enums, Prisma } from '@prisma/client'
import { EstablishmentSchedulesRepository } from '../establishment-schedules-repository'

export class PrismaEstablishmentSchedulesRepository
  implements EstablishmentSchedulesRepository
{
  async create(data: Prisma.EstablishmentScheduleUncheckedCreateInput) {
    const schedule = await prisma.establishmentSchedule.create({
      data,
    })

    return schedule
  }

  async findByEstablishmentId(establishmentId: string) {
    const schedule = await prisma.establishmentSchedule.findFirst({
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
