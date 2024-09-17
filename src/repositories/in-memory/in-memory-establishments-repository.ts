import { randomUUID } from 'node:crypto'
import { type Establishment, Prisma, type Role } from '@prisma/client'
import type { EstablishmentsRepository } from '../establishments-repository'

export class InMemoryEstablishmentsRepository implements EstablishmentsRepository {
	public items: Map<Establishment['id'], Establishment> = new Map()

	async create(data: Prisma.EstablishmentUncheckedCreateInput) {
		const establishment: Establishment = {
			id: randomUUID(),
			name: data.name,
			description: data.description ?? null,
			phone: data.phone ?? null,
			imageUrl: data.imageUrl ?? null,
			email: data.email,
			passwordHash: data.passwordHash,
			createdAt: new Date(),
			latitude: new Prisma.Decimal(data.latitude.toString()),
			longitude: new Prisma.Decimal(data.longitude.toString()),
			role: data.role as Role,
		}

		this.items.set(establishment.id, establishment)

		return establishment
	}

	async findById(id: string) {
		return this.items.get(id) || null
	}

	async findByEmail(email: string) {
		for (const establishment of this.items.values()) {
			if (establishment.email === email) {
				return establishment
			}
		}

		return null
	}
}
