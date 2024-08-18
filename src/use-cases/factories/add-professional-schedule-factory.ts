import { PrismaEstablishmentsRepository } from '@/repositories/prisma/prisma-establishments-repository'
import { PrismaEstablishmentsSchedulesRepository } from '@/repositories/prisma/prisma-establishments-schedule-repository'
import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository'
import { PrismaProfessionalsSchedulesRepository } from '@/repositories/prisma/prisma-professionals-schedule-repository'

import { AddProfessionalScheduleUseCase } from '../add-professional-schedule'

export function addProfessionalScheduleFactory() {
  const professionalsRepository = new PrismaProfessionalsRepository()
  const professionalSchedulesRepository =
    new PrismaProfessionalsSchedulesRepository()
  const establishmentsRepository = new PrismaEstablishmentsRepository()
  const establishmentSchedulesRepository =
    new PrismaEstablishmentsSchedulesRepository()

  const addProfessionalScheduleUseCase = new AddProfessionalScheduleUseCase(
    professionalsRepository,
    professionalSchedulesRepository,
    establishmentsRepository,
    establishmentSchedulesRepository,
  )

  return addProfessionalScheduleUseCase
}
