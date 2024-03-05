import { Prisma, Schedule } from '@prisma/client'

export interface SchedulesRepository {
  findByEstablishmentId(id: string): Promise<Schedule | null>
  create(data: Prisma.ScheduleUncheckedCreateInput): Promise<Schedule>
}
