import { Prisma, Professional } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { ProfessionalsRepository } from '../professionals-repository'

export class InMemoryProfessionalsRepository
  implements ProfessionalsRepository
{
  public items: Professional[] = []

  async findById(id: string) {
    const barber = this.items.find((item) => item.id === id)

    if (!barber) {
      return null
    }

    return barber
  }

  async create(data: Prisma.ProfessionalUncheckedCreateInput) {
    const barber = {
      id: randomUUID(),
      name: data.name,
      imageUrl: data.imageUrl ?? null,
      establishmentId: data.establishmentId,
    }

    this.items.push(barber)

    return barber
  }
}
