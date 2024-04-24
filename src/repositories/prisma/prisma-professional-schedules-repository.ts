import { prisma } from '@/prisma'
import { Prisma } from '@prisma/client'
import { ProfessionalSchedulesRepository } from '../professional-schedules-repository'

export class PrismaProfessionalSchedulesRepository
  implements ProfessionalSchedulesRepository
{
  async create(data: Prisma.ProfessionalScheduleUncheckedCreateInput) {
    const schedule = await prisma.professionalSchedule.create({
      data,
    })

    return schedule
  }

  async findByProfessionalId(professionalId: string) {
    const schedule = await prisma.professionalSchedule.findFirst({
      where: {
        professionalId,
      },
    })

    return schedule
  }
}
