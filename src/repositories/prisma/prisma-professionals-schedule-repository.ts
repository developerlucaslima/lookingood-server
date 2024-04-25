import { prisma } from '@/prisma'
import { $Enums, Prisma } from '@prisma/client'
import { ProfessionalsSchedulesRepository } from '../professionals-schedules-repository'

export class PrismaProfessionalsScheduleRepository
  implements ProfessionalsSchedulesRepository
{
  async create(data: Prisma.ProfessionalScheduleUncheckedCreateInput) {
    const schedule = await prisma.professionalSchedule.create({
      data,
    })

    return schedule
  }

  async findManyByProfessionalId(professionalId: string) {
    const schedule = await prisma.professionalSchedule.findMany({
      where: {
        professionalId,
      },
    })

    return schedule
  }

  async findByProfessionalIdAndWeekDay(
    professionalId: string,
    weekDay: $Enums.WeekDay,
  ) {
    const schedule = await prisma.professionalSchedule.findFirst({
      where: {
        professionalId,
        weekDay,
      },
    })

    return schedule
  }
}
