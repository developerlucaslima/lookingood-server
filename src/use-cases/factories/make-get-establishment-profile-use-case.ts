import { PrismaEstablishmentsRepository } from '@/repositories/prisma/prisma-establishments-repository'
import { GetEstablishmentProfileUseCase } from '../get-establishment-profile'

export function makeGetEstablishmentProfileUseCase() {
  const establishmentsRepository = new PrismaEstablishmentsRepository()
  const getEstablishmentProfileUseCase = new GetEstablishmentProfileUseCase(
    establishmentsRepository,
  )

  return getEstablishmentProfileUseCase
}
