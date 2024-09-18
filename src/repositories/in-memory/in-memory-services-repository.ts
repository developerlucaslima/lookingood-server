import { randomUUID } from 'node:crypto'
import { Prisma, type Service } from '@prisma/client'
import type { ServicesRepository } from '../services-repository'

export class InMemoryServicesRepository implements ServicesRepository {
	public items: Map<Service['id'], Service> = new Map()

	async create(data: Prisma.ServiceUncheckedCreateInput) {
		const id = randomUUID()
		const service: Service = {
			id,
			name: data.name,
			price: new Prisma.Decimal(data.price.toString()),
			genderFor: data.genderFor,
			description: data.description ?? null,
			imageUrl: data.imageUrl ?? null,
			durationMinutes: data.durationMinutes,
			modificationDeadlineMinutes: data.modificationDeadlineMinutes,
			establishmentId: data.establishmentId,
		}

		this.items.set(id, service)

		return service
	}

	async findById(id: string) {
		return this.items.get(id) || null
	}
}
