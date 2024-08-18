import { $Enums, EstablishmentSchedule, Prisma } from '@prisma/client'

export interface EstablishmentsSchedulesRepository {
  create(
    data: Prisma.EstablishmentScheduleUncheckedCreateInput,
  ): Promise<EstablishmentSchedule>
  findManyByEstablishmentId(
    establishmentId: string,
  ): Promise<EstablishmentSchedule[]>
  findByEstablishmentIdAndWeekDay(
    establishmentId: string,
    weekDay: $Enums.WeekDay,
  ): Promise<EstablishmentSchedule | null>
}
