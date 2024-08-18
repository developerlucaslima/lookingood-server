import { PrismaEstablishmentsRepository } from '@/repositories/prisma/prisma-establishments-repository'

import { EstablishmentRegisterUseCase } from '../establishment-register'

export function establishmentRegisterFactory() {
  const establishmentsRepository = new PrismaEstablishmentsRepository()
  const establishmentRegisterUseCase = new EstablishmentRegisterUseCase(
    establishmentsRepository,
  )

  return establishmentRegisterUseCase
}
