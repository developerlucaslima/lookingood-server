import { Prisma, EstablishmentSchedule } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { EstablishmentsSchedulesRepository } from '../establishments-schedules-repository'

export class InMemoryEstablishmentsScheduleRepository
  implements EstablishmentsSchedulesRepository
{
  public items: Map<EstablishmentSchedule['id'], EstablishmentSchedule> =
    new Map()

  async create(data: Prisma.EstablishmentScheduleUncheckedCreateInput) {
    const establishmentSchedule: EstablishmentSchedule = {
      id: randomUUID(),
      startTime: data.startTime,
      minutesWorking: data.minutesWorking,
      breakTime: data.breakTime ?? null,
      minutesBreak: data.minutesBreak ?? null,
      weekDay: data.weekDay,
      establishmentId: data.establishmentId,
    }

    this.items.set(establishmentSchedule.id, establishmentSchedule)

    return establishmentSchedule
  }

  async findManyByEstablishmentId(establishmentId: string) {
    const manySchedules: EstablishmentSchedule[] = []
    for (const schedule of this.items.values()) {
      if (schedule.establishmentId === establishmentId) {
        manySchedules.push(schedule)
      }
    }

    return manySchedules
  }

  async findByEstablishmentIdAndWeekDay(
    establishmentId: string,
    weekDay: string,
  ) {
    const schedules = Array.from(this.items.values()).flat()

    return (
      schedules.find(
        (schedule) =>
          schedule.establishmentId === establishmentId &&
          schedule.weekDay === weekDay,
      ) || null
    )
  }
}
