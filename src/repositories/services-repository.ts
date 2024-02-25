import { Service, Prisma } from '@prisma/client'

export interface ServicesRepository {
  create(data: Prisma.ServiceUncheckedCreateInput): Promise<Service>
  findById(id: string): Promise<Service | null>
  findByGender(gender: string): Promise<Service | null>
  // findAllByGender
  // findAllByEstablishmentId
}
