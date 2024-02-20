import { Establishment, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { EstablishmentsRepository } from '../establishments-repository'

export class InMemoryEstablishmentsRepository
  implements EstablishmentsRepository
{
  public items: Establishment[] = []

  async findById(id: string) {
    const establishment = this.items.find((item) => item.id === id)

    if (!establishment) {
      return null
    }

    return establishment
  }

  async findByEmail(email: string) {
    const establishment = this.items.find((item) => item.email === email)

    if (!establishment) {
      return null
    }

    return establishment
  }

  async create(data: Prisma.EstablishmentCreateInput) {
    const establishment = {
      id: randomUUID(),
      name: data.name,
      description: data.description ?? null,
      phone: data.phone ?? null,
      imageUrl: data.imageUrl ?? null,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
    }

    this.items.push(establishment)

    return establishment
  }
}
