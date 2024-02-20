import { Service, Prisma } from '@prisma/client'

export interface ServicesRepository {
  create(data: Prisma.ServiceUncheckedCreateInput): Promise<Service>
  // findAllByGender
  // findAllByEstablishmentId
}
