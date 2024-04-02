import { Prisma, Schedule } from '@prisma/client'

export interface SchedulesRepository {
  create(data: Prisma.ScheduleUncheckedCreateInput): Promise<Schedule>
  findByEstablishmentId(id: string): Promise<Schedule | null>
}
