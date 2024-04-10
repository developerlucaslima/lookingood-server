import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { makeUserAuthenticateUseCase } from '@/use-cases/factories/make-user-authenticate-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function userAuthenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { email, password } = z
    .object({
      email: z.string().email(),
      password: z.string().min(6),
    })
    .parse(request.body)

  try {
    const userAuthenticateUseCase = makeUserAuthenticateUseCase()
    const { user } = await userAuthenticateUseCase.execute({
      email,
      password,
    })

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      },
    )
    return reply.status(200).send({
      token,
    })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }
}
