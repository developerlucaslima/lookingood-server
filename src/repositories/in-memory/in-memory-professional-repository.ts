import { Prisma, Professional } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { ProfessionalsRepository } from '../professionals-repository'

export class InMemoryProfessionalsRepository
  implements ProfessionalsRepository
{
  public items: Map<Professional['id'], Professional> = new Map()

  async create(data: Prisma.ProfessionalUncheckedCreateInput) {
    const barber = {
      id: randomUUID(),
      name: data.name,
      imageUrl: data.imageUrl ?? null,
      establishmentId: data.establishmentId,
    }

    this.items.set(barber.id, barber)

    return barber
  }

  async findById(id: string) {
    const barber = this.items.get(id)

    if (!barber) {
      return null
    }

    return barber
  }

  // //e se tiver mais de milhões de entries? como que o banco de dados lida c/ isso?
  // async list(data: Prisma.ProfessionalUncheckedList) {
  //   const barbers = this.items.values()
  //   const results = []
  //   for(const b of barbers){
  //     //apply logic to filter
  //   }
  //   return results;
  // }
}
