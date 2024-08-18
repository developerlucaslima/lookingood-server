import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { EmailNotAvailableException } from '@/errors/email-not-available.exception.ts'
import { userRegisterFactory } from '@/use-cases/factories/user-register-factory'

export async function userRegisterController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { name, serviceGender, email, password } = z
    .object({
      name: z.string(),
      serviceGender: z.enum(['MALE', 'FEMALE', 'BOTH']),
      email: z.string().email(),
      password: z.string().min(6),
    })
    .parse(request.body)

  try {
    const userRegisterUseCase = userRegisterFactory()

    await userRegisterUseCase.execute({
      name,
      serviceGender,
      email,
      password,
    })
  } catch (err) {
    if (err instanceof EmailNotAvailableException) {
      return reply.status(409).send({ message: err.message })
    }

    throw err
  }

  return reply.status(201).send()
}
