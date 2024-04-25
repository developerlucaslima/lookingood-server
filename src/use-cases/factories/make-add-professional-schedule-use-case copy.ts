import { PrismaEstablishmentSchedulesRepository } from '@/repositories/prisma/prisma-establishment-schedules-repository'
import { PrismaEstablishmentsRepository } from '@/repositories/prisma/prisma-establishments-repository'
import { AddEstablishmentScheduleUseCase } from '../add-establishment-schedule'

export function makeAddEstablishmentScheduleUseCase() {
  const establishmentsRepository = new PrismaEstablishmentsRepository()
  const establishmentSchedulesRepository =
    new PrismaEstablishmentSchedulesRepository()

  const addEstablishmentScheduleUseCase = new AddEstablishmentScheduleUseCase(
    establishmentsRepository,
    establishmentSchedulesRepository,
  )

  return addEstablishmentScheduleUseCase
}
