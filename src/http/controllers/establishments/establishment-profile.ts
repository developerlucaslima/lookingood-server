import type { FastifyReply, FastifyRequest } from 'fastify'

import { establishmentProfileFactory } from '@/use-cases/factories/establishment-profile-factory'
import { EstablishmentNotFoundException } from '@/errors/establishment-not-found.exception'

export async function establishmentProfileController(request: FastifyRequest, reply: FastifyReply) {
	try {
		const establishmentProfileUseCase = establishmentProfileFactory()

		const { establishment } = await establishmentProfileUseCase.execute({
			establishmentId: request.user.sub,
		})

		return reply.status(200).send({
			establishment: {
				...establishment,
				passwordHash: undefined,
			},
		})
	} catch (err) {
		if (err instanceof EstablishmentNotFoundException) {
			return reply.status(err.code).send({ message: err.message })
		}

		throw err
	}
}
