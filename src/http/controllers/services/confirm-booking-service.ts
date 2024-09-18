import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { confirmBookingServiceFactory } from '@/use-cases/factories/confirm-booking-service-factory'
import { BookingNotFoundException } from '@/errors/booking-not-found.exception'
import { EstablishmentNotFoundException } from '@/errors/establishment-not-found.exception'
import { MismatchResourcesException } from '@/errors/mismatch-resources.exception'

export async function confirmBookingServiceController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { bookingId, establishmentId } = z
		.object({
			bookingId: z.string().uuid(),
			establishmentId: z.string().uuid(),
		})
		.parse(request.params)

	try {
		const confirmBookedServicesUseCase = confirmBookingServiceFactory()

		await confirmBookedServicesUseCase.execute({
			bookingId,
			establishmentId,
		})

		return reply.status(204).send()
	} catch (err) {
		if (
			err instanceof BookingNotFoundException ||
			err instanceof EstablishmentNotFoundException ||
			err instanceof MismatchResourcesException
		) {
			return reply.status(err.code).send({ message: err.message })
		}

		throw err
	}
}
