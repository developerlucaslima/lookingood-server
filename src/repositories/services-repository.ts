import type { Prisma, Service } from '@prisma/client'

export interface ServicesRepository {
	create(data: Prisma.ServiceUncheckedCreateInput): Promise<Service>
	findById(id: string): Promise<Service | null>
}
