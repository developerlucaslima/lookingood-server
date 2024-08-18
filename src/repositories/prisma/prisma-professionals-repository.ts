import { Prisma } from '@prisma/client'

import { prisma } from '@/prisma'

import { ProfessionalsRepository } from '../professionals-repository'

export class PrismaProfessionalsRepository implements ProfessionalsRepository {
  async create(data: Prisma.ProfessionalUncheckedCreateInput) {
    const professional = await prisma.professional.create({
      data,
    })

    return professional
  }

  async findById(id: string) {
    const professional = await prisma.professional.findUnique({
      where: {
        id,
      },
    })

    return professional
  }
}
