import { PrismaClient } from '@prisma/client'
import 'dotenv/config'
import { execSync } from 'node:child_process'

import { randomUUID } from 'node:crypto'
import type { Environment } from 'vitest'

const prisma = new PrismaClient()

export default (<Environment>{
	name: 'prisma',
	transformMode: 'ssr',
	async setup() {
		const randomSchema = randomUUID()
		const databaseURL = setSchemaDatabaseURL(randomSchema)

		process.env.DATABASE_URL = databaseURL

		execSync('npx prisma migrate deploy')

		return {
			async teardown() {
				await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${randomSchema}" CASCADE`)

				await prisma.$disconnect()
			},
		}
	},
})

function setSchemaDatabaseURL(schema: string) {
	if (!process.env.DATABASE_URL) {
		throw new Error('Please specify a DATABASE_URL environment variable.')
	}

	const url = new URL(process.env.DATABASE_URL)
	url.searchParams.set('schema', schema)

	return url.toString()
}
