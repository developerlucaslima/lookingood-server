import { Prisma, Schedule } from '@prisma/client'

export interface SchedulesRepository {
  create(data: Prisma.ScheduleUncheckedCreateInput): Promise<Schedule>
  findByEstablishmentId(establishmentId: string): Promise<Schedule | null>
}
