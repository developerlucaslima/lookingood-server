import { EmailAlreadyExistsError } from '@/use-cases/errors/email-already-exists-error'
import { makeUserRegisterUseCase } from '@/use-cases/factories/make-user-register-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function userRegister(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { name, serviceGender, email, password } = z
    .object({
      name: z.string(),
      serviceGender: z.enum(['Male', 'Female', 'Both']),
      email: z.string().email(),
      password: z.string().min(6),
    })
    .parse(request.body)

  try {
    const userRegisterUseCase = makeUserRegisterUseCase()

    await userRegisterUseCase.execute({
      name,
      serviceGender,
      email,
      password,
    })
  } catch (err) {
    if (err instanceof EmailAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }

    throw err
  }

  return reply.status(201).send()
}
