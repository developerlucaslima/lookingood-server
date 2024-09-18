import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { EstablishmentNotFoundException } from '@/errors/establishment-not-found.exception'
import { addServiceFactory } from '@/use-cases/factories/add-service-factory'
import { InvalidServiceDurationException } from '@/errors/invalid-service-duration.exception'
import { InvalidGenderException } from '@/errors/invalid-gender.exception'

export async function addServiceController(request: FastifyRequest, reply: FastifyReply) {
	const {
		name,
		price,
		genderFor,
		description,
		imageUrl,
		modificationDeadlineMinutes,
		durationMinutes,
	} = z
		.object({
			name: z.string(),
			price: z.number().positive(),
			genderFor: z.enum(['MALE', 'FEMALE', 'BOTH']),
			description: z.string().nullable(),
			imageUrl: z.string().nullable(),
			modificationDeadlineMinutes: z.number().positive(),
			durationMinutes: z.number().positive(),
		})
		.parse(request.body)

	try {
		const addServiceUseCase = addServiceFactory()

		await addServiceUseCase.execute({
			name,
			price,
			genderFor,
			description,
			imageUrl,
			modificationDeadlineMinutes,
			establishmentId: request.user.sub,
			durationMinutes,
		})
	} catch (err) {
		if (
			err instanceof EstablishmentNotFoundException ||
			err instanceof InvalidServiceDurationException ||
			err instanceof InvalidGenderException
		) {
			return reply.status(err.code).send({ message: err.message })
		}

		throw err
	}

	return reply.status(201).send()
}
