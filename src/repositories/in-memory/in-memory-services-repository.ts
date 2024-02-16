import { Prisma, Service } from '@prisma/client'
// import dayjs from 'dayjs'
import { randomUUID } from 'node:crypto'
import { ServicesRepository } from '../services-repository'

export class InMemoryServicesRepository implements ServicesRepository {
  public items: Service[] = []

  async create(data: Prisma.ServiceUncheckedCreateInput) {
    const service = {
      id: randomUUID(),
      name: data.name,
      price: new Prisma.Decimal(data.price.toString()),
      description: data.description ?? null,
      imageUrl: data.imageUrl ?? null,
      establishmentId: data.establishmentId,
    }

    this.items.push(service)

    return service
  }
}
