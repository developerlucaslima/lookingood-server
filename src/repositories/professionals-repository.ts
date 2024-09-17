import type { Prisma, Professional } from '@prisma/client'

export interface ProfessionalsRepository {
	create(data: Prisma.ProfessionalUncheckedCreateInput): Promise<Professional>
	findById(id: string): Promise<Professional | null>
}
