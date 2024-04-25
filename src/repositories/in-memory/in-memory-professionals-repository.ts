import { Prisma, Professional } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { ProfessionalsRepository } from '../professionals-repository'

export class InMemoryProfessionalsRepository
  implements ProfessionalsRepository
{
  public items: Map<Professional['id'], Professional> = new Map()

  async create(data: Prisma.ProfessionalUncheckedCreateInput) {
    const establishment: Professional = {
      id: randomUUID(),
      name: data.name,
      imageUrl: data.imageUrl ?? null,
      establishmentId: data.establishmentId,
    }

    this.items.set(establishment.id, establishment)

    return establishment
  }

  async findById(id: string) {
    return this.items.get(id) || null
  }
}
