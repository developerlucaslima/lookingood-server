import { PrismaBookingsRepository } from '@/repositories/prisma/prisma-bookings-repository'
import { PrismaEstablishmentsRepository } from '@/repositories/prisma/prisma-establishments-repository'

import { ConfirmBookingServiceUseCase } from '../confirm-booking-service'

export function confirmBookingServiceFactory() {
	const reservationsRepository = new PrismaBookingsRepository()
	const establishmentsRepository = new PrismaEstablishmentsRepository()
	const confirmBookingServiceUseCase = new ConfirmBookingServiceUseCase(
		reservationsRepository,
		establishmentsRepository,
	)

	return confirmBookingServiceUseCase
}
