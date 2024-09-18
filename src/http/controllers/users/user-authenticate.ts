import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { InvalidCredentialsException } from '@/errors/invalid-credentials.exception'
import { userAuthenticateFactory } from '@/use-cases/factories/user-authenticate-factory'

export async function userAuthenticateController(request: FastifyRequest, reply: FastifyReply) {
	const { email, password } = z
		.object({
			email: z.string().email(),
			password: z.string().min(6),
		})
		.parse(request.body)

	try {
		const userAuthenticateUseCase = userAuthenticateFactory()
		const { user } = await userAuthenticateUseCase.execute({
			email,
			password,
		})

		const token = await reply.jwtSign(
			{ role: user.role },
			{
				sign: {
					sub: user.id,
				},
			},
		)

		const refreshToken = await reply.jwtSign(
			{ role: user.role },
			{
				sign: {
					sub: user.id,
					expiresIn: '35d',
				},
			},
		)

		return reply
			.setCookie('refreshToken', refreshToken, {
				path: '/',
				secure: true,
				sameSite: true,
				httpOnly: true,
			})
			.status(200)
			.send({
				token,
			})
	} catch (err) {
		if (err instanceof InvalidCredentialsException) {
			return reply.status(err.code).send({ message: err.message })
		}
		throw err
	}
}
