import fastifyCookie from '@fastify/cookie'
import cors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastify from 'fastify'
import { ZodError } from 'zod'

import { env } from '@/env'

import { appEstablishment } from './http/controllers/establishments/_routes'
import { appServiceRoutes } from './http/controllers/services/_routes'
import { appUserRoutes } from './http/controllers/users/_routes'

export const app = fastify()

app.register(cors, {
	origin: env.ORIGIN_URL,
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
	credentials: true,
})

app.register(fastifyJwt, {
	secret: env.JWT_SECRET,
	sign: {
		expiresIn: '10m',
	},
})

app.register(fastifyCookie)
app.register(appUserRoutes)
app.register(appServiceRoutes)
app.register(appEstablishment)

app.setErrorHandler((error, _, reply) => {
	if (error instanceof ZodError) {
		return reply.status(400).send({ message: 'Validation error.', issues: error.format() })
	}

	if (env.NODE_ENV !== 'production') {
		console.error(error)
	} else {
		// TODO: Integrate with logging tool like Sentry
	}

	return reply.status(500).send({ message: '❌ Internal server error.' })
})
