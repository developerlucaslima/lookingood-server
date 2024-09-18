import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { updateBookingServiceFactory } from '@/use-cases/factories/update-booking-service-factory'
import { BookingNotFoundException } from '@/errors/booking-not-found.exception'
import { UserNotFoundException } from '@/errors/user-not-found.exception'
import { MismatchResourcesException } from '@/errors/mismatch-resources.exception'
import { ServiceNotFoundException } from '@/errors/service-not-found.exception'
import { ModificationDeadlineExceededException } from '@/errors/modification-deadline-exceeded.exception'
import { ProfessionalNotFoundException } from '@/errors/professional-not-found.exception'
import { TimetableNotAvailableException } from '@/errors/timetable-not-available.exception'
import { ProfessionalNotAvailableException } from '@/errors/professional-not-available.exception'

export async function updateBookingServiceController(request: FastifyRequest, reply: FastifyReply) {
	const { userId } = z
		.object({
			userId: z.string().uuid(),
		})
		.parse(request.params)

	const { startTime, serviceId, bookingId, professionalId } = z
		.object({
			startTime: z.date().min(new Date(), {
				message: "That date has passed, we don't have a time machine. 😑",
			}),
			serviceId: z.string().uuid(),
			bookingId: z.string().uuid(),
			professionalId: z.string().uuid(),
		})
		.parse(request.body)

	try {
		const updateBookingServiceUseCase = updateBookingServiceFactory()

		await updateBookingServiceUseCase.execute({
			professionalId,
			startTime,
			userId,
			serviceId,
			bookingId,
		})

		return reply.status(204).send()
	} catch (err) {
		if (
			err instanceof BookingNotFoundException ||
			err instanceof UserNotFoundException ||
			err instanceof MismatchResourcesException ||
			err instanceof ServiceNotFoundException ||
			err instanceof ModificationDeadlineExceededException ||
			err instanceof ProfessionalNotFoundException ||
			err instanceof TimetableNotAvailableException ||
			err instanceof ProfessionalNotAvailableException
		) {
			return reply.status(err.code).send({ message: err.message })
		}

		throw err
	}
}
