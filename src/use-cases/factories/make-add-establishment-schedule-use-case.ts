import { PrismaEstablishmentSchedulesRepository } from '@/repositories/prisma/prisma-establishment-schedules-repository'
import { PrismaEstablishmentsRepository } from '@/repositories/prisma/prisma-establishments-repository'
import { AddEstablishmentScheduleUseCase } from '../add-establishment-schedule'

export function makeAddEstablishmentScheduleUseCase() {
  const establishmentsRepository = new PrismaEstablishmentsRepository()
  const professionalsRepository = new PrismaEstablishmentSchedulesRepository()

  const addEstablishmentScheduleUseCase = new AddEstablishmentScheduleUseCase(
    establishmentsRepository,
    professionalsRepository,
  )

  return addEstablishmentScheduleUseCase
}
