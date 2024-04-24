import { $Enums, EstablishmentSchedule, Prisma } from '@prisma/client'

export interface EstablishmentSchedulesRepository {
  create(
    data: Prisma.EstablishmentScheduleUncheckedCreateInput,
  ): Promise<EstablishmentSchedule>
  findByEstablishmentId(
    establishmentId: string,
  ): Promise<EstablishmentSchedule | null>
  findByEstablishmentIdAndWeekDay(
    establishmentId: string,
    weekDay: $Enums.WeekDay,
  ): Promise<EstablishmentSchedule | null>
}
