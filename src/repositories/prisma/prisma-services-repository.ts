import { Prisma } from '@prisma/client'

import { prisma } from '@/prisma'

import { ServicesRepository } from '../services-repository'

export class PrismaServicesRepository implements ServicesRepository {
  async create(data: Prisma.ServiceUncheckedCreateInput) {
    const service = await prisma.service.create({
      data,
    })

    return service
  }

  async findById(id: string) {
    const service = await prisma.service.findUnique({
      where: {
        id,
      },
    })

    return service
  }
}
