import { PrismaEstablishmentsRepository } from '@/repositories/prisma/prisma-establishments-repository'
import { PrismaSchedulesRepository } from '@/repositories/prisma/prisma-schedules-repository'
import { AddScheduleUseCase } from '../add-schedule'

export function makeAddScheduleUseCase() {
  const establishmentsRepository = new PrismaEstablishmentsRepository()
  const professionalsRepository = new PrismaSchedulesRepository()

  const addScheduleUseCase = new AddScheduleUseCase(
    establishmentsRepository,
    professionalsRepository,
  )

  return addScheduleUseCase
}
