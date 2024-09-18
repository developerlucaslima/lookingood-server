import { PrismaBookingsRepository } from '@/repositories/prisma/prisma-bookings-repository'
import { PrismaEstablishmentsRepository } from '@/repositories/prisma/prisma-establishments-repository'
import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository'
import { PrismaProfessionalsSchedulesRepository } from '@/repositories/prisma/prisma-professionals-schedule-repository'
import { PrismaServicesRepository } from '@/repositories/prisma/prisma-services-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

import { BookingServiceUseCase } from '../booking-service'

export function bookingServiceFactory() {
	const establishmentsRepository = new PrismaEstablishmentsRepository()
	const professionalsRepository = new PrismaProfessionalsRepository()
	const professionalSchedulesRepository = new PrismaProfessionalsSchedulesRepository()
	const servicesRepository = new PrismaServicesRepository()
	const reservationsRepository = new PrismaBookingsRepository()
	const usersRepository = new PrismaUsersRepository()

	const serviceBookingUseCase = new BookingServiceUseCase(
		establishmentsRepository,
		professionalsRepository,
		professionalSchedulesRepository,
		servicesRepository,
		reservationsRepository,
		usersRepository,
	)

	return serviceBookingUseCase
}
