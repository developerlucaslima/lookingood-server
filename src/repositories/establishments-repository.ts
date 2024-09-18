import type { Establishment, Prisma } from '@prisma/client'

export interface EstablishmentsRepository {
	create(data: Prisma.EstablishmentCreateInput): Promise<Establishment>
	findById(id: string): Promise<Establishment | null>
	findByEmail(email: string): Promise<Establishment | null>
}
