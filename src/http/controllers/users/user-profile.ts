import type { FastifyReply, FastifyRequest } from 'fastify'

import { userProfileFactory } from '@/use-cases/factories/user-profile-factory'
import { UserNotFoundException } from '@/errors/user-not-found.exception'

export async function userProfileController(request: FastifyRequest, reply: FastifyReply) {
	try {
		const userProfileUseCase = userProfileFactory()

		const { user } = await userProfileUseCase.execute({
			userId: request.user.sub,
		})

		return reply.status(200).send({
			user: {
				...user,
				passwordHash: undefined,
			},
		})
	} catch (err) {
		if (err instanceof UserNotFoundException) {
			return reply.status(err.code).send({ message: err.message })
		}

		throw err
	}
}
