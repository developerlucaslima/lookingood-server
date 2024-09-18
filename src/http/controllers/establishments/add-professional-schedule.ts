import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { ProfessionalNotFoundException } from '@/errors/professional-not-found.exception'
import { addProfessionalScheduleFactory } from '@/use-cases/factories/add-professional-schedule-factory'
import { InvalidInputParametersException } from '@/errors/invalid-input-parameters.exception'
import { InvalidScheduleException } from '@/errors/invalid-schedule.exception'
import { EstablishmentNotFoundException } from '@/errors/establishment-not-found.exception'

export async function addProfessionalScheduleController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/
	const invalidTime = 'Invalid time'

	const { startTime, minutesWorking, breakTime, minutesBreak, weekDay } = z
		.object({
			startTime: z.string().regex(timeRegex, { message: invalidTime }),
			minutesWorking: z.number().min(2).max(4),
			breakTime: z.string().regex(timeRegex, { message: invalidTime }),
			minutesBreak: z.number().min(2).max(3),
			weekDay: z.enum([
				'MONDAY',
				'TUESDAY',
				'WEDNESDAY',
				'THURSDAY',
				'FRIDAY',
				'SATURDAY',
				'SUNDAY',
			]),
		})
		.parse(request.body)

	try {
		const addProfessionalScheduleUseCase = addProfessionalScheduleFactory()

		await addProfessionalScheduleUseCase.execute({
			startTime,
			minutesWorking,
			breakTime,
			minutesBreak,
			weekDay,
			professionalId: request.user.sub,
		})
	} catch (err) {
		if (
			err instanceof ProfessionalNotFoundException ||
			err instanceof EstablishmentNotFoundException ||
			err instanceof InvalidScheduleException ||
			err instanceof InvalidInputParametersException
		) {
			return reply.status(err.code).send({ message: err.message })
		}

		throw err
	}

	return reply.status(201).send()
}
