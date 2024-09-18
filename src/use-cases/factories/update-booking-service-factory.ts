import { PrismaBookingsRepository } from '@/repositories/prisma/prisma-bookings-repository'
import { PrismaEstablishmentsRepository } from '@/repositories/prisma/prisma-establishments-repository'
import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository'
import { PrismaProfessionalsSchedulesRepository } from '@/repositories/prisma/prisma-professionals-schedule-repository'
import { PrismaServicesRepository } from '@/repositories/prisma/prisma-services-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

import { UpdateBookingServiceUseCase } from '../update-booking-service'

export function updateBookingServiceFactory() {
	const establishmentsRepository = new PrismaEstablishmentsRepository()
	const professionalsRepository = new PrismaProfessionalsRepository()
	const servicesRepository = new PrismaServicesRepository()
	const professionalSchedulesRepository = new PrismaProfessionalsSchedulesRepository()
	const reservationsRepository = new PrismaBookingsRepository()
	const usersRepository = new PrismaUsersRepository()

	const serviceBookingUpdateUseCase = new UpdateBookingServiceUseCase(
		establishmentsRepository,
		professionalsRepository,
		professionalSchedulesRepository,
		servicesRepository,
		reservationsRepository,
		usersRepository,
	)

	return serviceBookingUpdateUseCase
}
