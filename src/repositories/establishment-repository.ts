import { Establishment, Prisma } from '@prisma/client'

export interface GymsRepository {
  findById(id: string): Promise<Establishment | null>
  create(data: Prisma.EstablishmentCreateInput): Promise<Establishment>
}
