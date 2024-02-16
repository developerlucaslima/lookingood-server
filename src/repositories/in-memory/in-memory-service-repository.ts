import { Prisma, Service } from '@prisma/client'
// import dayjs from 'dayjs'
import { randomUUID } from 'node:crypto'
import { ServicesRepository } from '../services-repository'

export class InMemoryServicesRepository implements ServicesRepository {
  public items: Service[] = []

  // async findByUserIdOnDate(userId: string, date: Date) {
  //   const startOfTheDay = dayjs(date).startOf('date')
  //   const endOfTheDay = dayjs(date).endOf('date')

  //   const serviceOnSameDate = this.items.find((service) => {
  //     const serviceDate = dayjs(service.created_at)
  //     const isOnSameDate =
  //       serviceDate.isAfter(startOfTheDay) && serviceDate.isBefore(endOfTheDay)

  //     return service.user_id === userId && isOnSameDate
  //   })

  //   if (!serviceOnSameDate) {
  //     return null
  //   }

  //   return serviceOnSameDate
  // }

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
