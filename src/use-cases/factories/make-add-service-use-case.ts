import { AddServiceUseCase } from '../add-service'
import { PrismaEstablishmentsRepository } from '@/repositories/prisma/prisma-establishments-repository'
import { PrismaServicesRepository } from '@/repositories/prisma/prisma-services-repository copy'

export function makeAddServiceUseCase() {
  const establishmentsRepository = new PrismaEstablishmentsRepository()
  const servicesRepository = new PrismaServicesRepository()

  const addServiceUseCase = new AddServiceUseCase(
    establishmentsRepository,
    servicesRepository,
  )

  return addServiceUseCase
}
