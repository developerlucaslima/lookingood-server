import { Prisma, ProfessionalSchedule } from '@prisma/client'

export interface ProfessionalSchedulesRepository {
  create(
    data: Prisma.ProfessionalScheduleUncheckedCreateInput,
  ): Promise<ProfessionalSchedule>
  findByProfessionalId(
    establishmentId: string,
  ): Promise<ProfessionalSchedule | null>
}
