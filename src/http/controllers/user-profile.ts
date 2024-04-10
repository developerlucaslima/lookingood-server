import { FastifyReply, FastifyRequest } from 'fastify'

export async function userProfile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  await request.jwtVerify()

  console.log(request.user.sub)

  return reply.status(200).send()
}
