import { Prisma } from '@prisma/client'

import { prisma } from '@/prisma'

import { EstablishmentsRepository } from '../establishments-repository'

export class PrismaEstablishmentsRepository
  implements EstablishmentsRepository
{
  async create(data: Prisma.EstablishmentUncheckedCreateInput) {
    const establishment = await prisma.establishment.create({
      data,
    })

    return establishment
  }

  async findById(id: string) {
    const establishment = await prisma.establishment.findUnique({
      where: {
        id,
      },
    })

    return establishment
  }

  async findByEmail(email: string) {
    const establishment = await prisma.establishment.findUnique({
      where: {
        email,
      },
    })

    return establishment
  }
}
