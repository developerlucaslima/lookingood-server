import { Prisma, Service } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { ServicesRepository } from '../services-repository'

export class InMemoryServicesRepository implements ServicesRepository {
  public items: Service[] = []

  async findById(id: string) {
    const service = this.items.find((item) => item.id === id)

    if (!service) {
      return null
    }

    return service
  }

  async create(data: Prisma.ServiceUncheckedCreateInput) {
    const service = {
      id: randomUUID(),
      name: data.name,
      price: new Prisma.Decimal(data.price.toString()),
      genderFor: data.genderFor,
      description: data.description ?? null,
      imageUrl: data.imageUrl ?? null,
      modificationDeadlineMinutes: data.modificationDeadlineMinutes,
      establishmentId: data.establishmentId,
      durationMinutes: data.durationMinutes,
    }

    this.items.push(service)

    return service
  }
}
