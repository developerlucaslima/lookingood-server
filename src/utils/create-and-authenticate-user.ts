import { hash } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import request from 'supertest'

import { prisma } from '@/prisma'

export async function createAndAuthenticateUser(app: FastifyInstance) {
	await prisma.user.create({
		data: {
			name: 'John Doe',
			email: 'john.doe@gmail.com',
			passwordHash: await hash('123456', 6),
			serviceGender: 'MALE',
		},
	})

	const authResponse = await request(app.server).post('/usersAuth').send({
		email: 'john.doe@gmail.com',
		password: '123456',
	})

	const { token } = authResponse.body

	return {
		token,
	}
}
