import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { EmailNotAvailableException } from '@/errors/email-not-available.exception.ts'
import { userRegisterFactory } from '@/use-cases/factories/user-register-factory'

export async function userRegisterController(request: FastifyRequest, reply: FastifyReply) {
	const { name, serviceGender, email, password } = z
		.object({
			name: z.string(),
			email: z.string().email(),
			password: z.string().min(6),
			serviceGender: z.enum(['MALE', 'FEMALE', 'BOTH']),
		})
		.parse(request.body)

	try {
		const userRegisterUseCase = userRegisterFactory()

		await userRegisterUseCase.execute({
			name,
			email,
			password,
			serviceGender,
		})
	} catch (err) {
		if (err instanceof EmailNotAvailableException) {
			return reply.status(err.code).send({ message: err.message })
		}

		throw err
	}

	return reply.status(201).send()
}
