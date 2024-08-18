import { PrismaEstablishmentsRepository } from '@/repositories/prisma/prisma-establishments-repository'

import { EstablishmentProfileUseCase } from '../establishment-profile'

export function establishmentProfileFactory() {
  const establishmentsRepository = new PrismaEstablishmentsRepository()
  const establishmentProfileUseCase = new EstablishmentProfileUseCase(
    establishmentsRepository,
  )

  return establishmentProfileUseCase
}
