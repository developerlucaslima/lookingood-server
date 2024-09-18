import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { bookingServiceFactory } from '@/use-cases/factories/booking-service-factory'
import { ProfessionalNotFoundException } from '@/errors/professional-not-found.exception'
import { ServiceNotFoundException } from '@/errors/service-not-found.exception'
import { UserNotFoundException } from '@/errors/user-not-found.exception'
import { EstablishmentNotFoundException } from '@/errors/establishment-not-found.exception'
import { MismatchResourcesException } from '@/errors/mismatch-resources.exception'
import { TimetableNotAvailableException } from '@/errors/timetable-not-available.exception'
import { ProfessionalNotAvailableException } from '@/errors/professional-not-available.exception'

export async function bookingServiceController(request: FastifyRequest, reply: FastifyReply) {
	const { startTime, serviceId, professionalId, establishmentId } = z
		.object({
			startTime: z.date().min(new Date(), {
				message: "That date has passed, we don't have a time machine. 😑",
			}),
			serviceId: z.string().uuid(),
			professionalId: z.string().uuid(),
			establishmentId: z.string().uuid(),
		})
		.parse(request.body)

	try {
		const bookingServiceUseCase = bookingServiceFactory()

		await bookingServiceUseCase.execute({
			startTime,
			userId: request.user.sub,
			serviceId,
			professionalId,
			establishmentId,
		})

		return reply.status(201).send()
	} catch (err) {
		if (
			err instanceof ProfessionalNotFoundException ||
			err instanceof ServiceNotFoundException ||
			err instanceof UserNotFoundException ||
			err instanceof EstablishmentNotFoundException ||
			err instanceof MismatchResourcesException ||
			err instanceof TimetableNotAvailableException ||
			err instanceof ProfessionalNotAvailableException
		) {
			return reply.status(err.code).send({ message: err.message })
		}

		throw err
	}
}
