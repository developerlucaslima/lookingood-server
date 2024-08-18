import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { InvalidCredentialsException } from '@/errors/invalid-credentials.exception'
import { makeEstablishmentAuthenticateUseCase } from '@/use-cases/factories/make-establishment-authenticate-use-case'

export async function establishmentAuthenticateController(
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
    const establishmentAuthenticateUseCase =
      makeEstablishmentAuthenticateUseCase()
    const { establishment } = await establishmentAuthenticateUseCase.execute({
      email,
      password,
    })

    const token = await reply.jwtSign(
      { role: establishment.role },
      {
        sign: {
          sub: establishment.id,
        },
      },
    )

    const refreshToken = await reply.jwtSign(
      { role: establishment.role },
      {
        sign: {
          sub: establishment.id,
          expiresIn: '3d',
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
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }
}
