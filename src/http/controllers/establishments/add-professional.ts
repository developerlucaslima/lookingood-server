import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { EstablishmentNotFoundException } from '@/errors/establishment-not-found.exception'
import { addProfessionalFactory } from '@/use-cases/factories/add-professional-factory'

export async function addProfessionalController(request: FastifyRequest, reply: FastifyReply) {
	const { name, imageUrl } = z
		.object({
			name: z.string(),
			imageUrl: z.string().nullable(),
		})
		.parse(request.body)

	try {
		const addProfessionalUseCase = addProfessionalFactory()

		await addProfessionalUseCase.execute({
			name,
			imageUrl,
			establishmentId: request.user.sub,
		})
	} catch (err) {
		if (err instanceof EstablishmentNotFoundException) {
			return reply.status(err.code).send({ message: err.message })
		}

		throw err
	}

	return reply.status(201).send()
}
