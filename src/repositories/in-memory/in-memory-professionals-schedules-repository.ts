import { Prisma, ProfessionalSchedule } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { ProfessionalsSchedulesRepository } from '../professionals-schedules-repository'

export class InMemoryProfessionalsSchedulesRepository
  implements ProfessionalsSchedulesRepository
{
  public items: Map<ProfessionalSchedule['id'], ProfessionalSchedule> =
    new Map()

  async create(data: Prisma.ProfessionalScheduleUncheckedCreateInput) {
    const professionalSchedule: ProfessionalSchedule = {
      id: randomUUID(),
      startTime: data.startTime,
      minutesWorking: data.minutesWorking,
      breakTime: data.breakTime ?? null,
      minutesBreak: data.minutesBreak ?? null,
      weekDay: data.weekDay,
      professionalId: data.professionalId,
    }

    this.items.set(professionalSchedule.id, professionalSchedule)

    return professionalSchedule
  }

  async findManyByProfessionalId(professionalId: string) {
    const manySchedules: ProfessionalSchedule[] = []
    for (const schedule of this.items.values()) {
      if (schedule.professionalId === professionalId) {
        manySchedules.push(schedule)
      }
    }
    return manySchedules
  }

  async findByProfessionalIdAndWeekDay(
    professionalId: string,
    weekDay: string,
  ) {
    const schedules = Array.from(this.items.values()).flat()
    return (
      schedules.find(
        (schedule) =>
          schedule.professionalId === professionalId &&
          schedule.weekDay === weekDay,
      ) || null
    )
  }
}
