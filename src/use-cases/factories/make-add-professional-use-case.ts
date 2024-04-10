import { PrismaEstablishmentsRepository } from '@/repositories/prisma/prisma-establishments-repository'
import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository'
import { AddProfessionalUseCase } from '../add-professional'

export function makeAddProfessionalUseCase() {
  const establishmentsRepository = new PrismaEstablishmentsRepository()
  const professionalsRepository = new PrismaProfessionalsRepository()

  const addProfessionalUseCase = new AddProfessionalUseCase(
    establishmentsRepository,
    professionalsRepository,
  )

  return addProfessionalUseCase
}
