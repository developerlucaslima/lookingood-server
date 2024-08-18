import { PrismaEstablishmentsRepository } from '@/repositories/prisma/prisma-establishments-repository'
import { PrismaEstablishmentsSchedulesRepository } from '@/repositories/prisma/prisma-establishments-schedule-repository'

import { AddEstablishmentScheduleUseCase } from '../add-establishment-schedule'

export function addEstablishmentScheduleFactory() {
  const establishmentsRepository = new PrismaEstablishmentsRepository()
  const professionalsRepository = new PrismaEstablishmentsSchedulesRepository()

  const addEstablishmentScheduleUseCase = new AddEstablishmentScheduleUseCase(
    establishmentsRepository,
    professionalsRepository,
  )

  return addEstablishmentScheduleUseCase
}
