import { Prisma } from '@prisma/client'
import { prisma } from '@/prisma'
import { SchedulesRepository } from '../schedules-repository'

export class PrismaSchedulesRepository implements SchedulesRepository {
  async create(data: Prisma.ScheduleUncheckedCreateInput) {
    const schedule = await prisma.schedule.create({
      data,
    })

    return schedule
  }

  async findByEstablishmentId(establishmentId: string) {
    const schedule = await prisma.schedule.findFirst({
      where: {
        establishmentId,
      },
    })

    return schedule
  }
}
