import { PrismaProfessionalSchedulesRepository } from '@/repositories/prisma/prisma-professional-schedules-repository'
import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository'
import { AddProfessionalScheduleUseCase } from '../add-professional-schedule'
import { PrismaEstablishmentsRepository } from '@/repositories/prisma/prisma-establishments-repository'
import { PrismaEstablishmentSchedulesRepository } from '@/repositories/prisma/prisma-establishment-schedules-repository'

export function makeAddProfessionalScheduleUseCase() {
  const professionalsRepository = new PrismaProfessionalsRepository()
  const professionalSchedulesRepository =
    new PrismaProfessionalSchedulesRepository()
  const establishmentsRepository = new PrismaEstablishmentsRepository()
  const establishmentSchedulesRepository =
    new PrismaEstablishmentSchedulesRepository()

  const professionalScheduleUseCase = new AddProfessionalScheduleUseCase(
    professionalsRepository,
    professionalSchedulesRepository,
    establishmentsRepository,
    establishmentSchedulesRepository,
  )

  return professionalScheduleUseCase
}
