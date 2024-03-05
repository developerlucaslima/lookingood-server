import { Prisma, Service } from '@prisma/client'
// import dayjs from 'dayjs'
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

  async findByGender(genderFor: string) {
    const service = this.items.find((item) => item.genderFor === genderFor)

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
      establishmentId: data.establishmentId,
      durationMinutes: data.durationMinutes,
    }

    this.items.push(service)

    return service
  }
}
