import { PrismaEstablishmentsRepository } from '@/repositories/prisma/prisma-establishments-repository'
import { PrismaServicesRepository } from '@/repositories/prisma/prisma-services-repository'

import { AddServiceUseCase } from '../add-service'

export function addServiceFactory() {
	const establishmentsRepository = new PrismaEstablishmentsRepository()
	const servicesRepository = new PrismaServicesRepository()

	const addServiceUseCase = new AddServiceUseCase(establishmentsRepository, servicesRepository)

	return addServiceUseCase
}
