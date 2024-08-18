import { PrismaEstablishmentsRepository } from '@/repositories/prisma/prisma-establishments-repository'

import { EstablishmentAuthenticateUseCase } from '../establishment-authenticate'

export function establishmentAuthenticateFactory() {
  const establishmentsRepository = new PrismaEstablishmentsRepository()
  const establishmentAuthenticateUseCase = new EstablishmentAuthenticateUseCase(
    establishmentsRepository,
  )

  return establishmentAuthenticateUseCase
}
