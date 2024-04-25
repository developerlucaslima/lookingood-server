import { $Enums, Prisma, ProfessionalSchedule } from '@prisma/client'

export interface ProfessionalSchedulesRepository {
  create(
    data: Prisma.ProfessionalScheduleUncheckedCreateInput,
  ): Promise<ProfessionalSchedule>
  findByProfessionalId(
    establishmentId: string,
  ): Promise<ProfessionalSchedule | null>
  findByProfessionalIdAndWeekDay(
    professionalId: string,
    weekDay: $Enums.WeekDay,
  ): Promise<ProfessionalSchedule | null>
}
