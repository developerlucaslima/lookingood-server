import { $Enums, Prisma, ProfessionalSchedule } from '@prisma/client'

export interface ProfessionalsSchedulesRepository {
  create(
    data: Prisma.ProfessionalScheduleUncheckedCreateInput,
  ): Promise<ProfessionalSchedule>
  findManyByProfessionalId(
    professionalId: string,
  ): Promise<ProfessionalSchedule[]>
  findByProfessionalIdAndWeekDay(
    professionalId: string,
    weekDay: $Enums.WeekDay,
  ): Promise<ProfessionalSchedule | null>
}
