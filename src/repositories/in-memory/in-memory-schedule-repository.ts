import { Schedule, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { SchedulesRepository } from '../schedule-repository'

export class InMemorySchedulesRepository implements SchedulesRepository {
  public items: Schedule[] = []

  async findByEstablishmentId(establishmentId: string) {
    const schedule = this.items.find(
      (item) => item.establishmentId === establishmentId,
    )

    if (!schedule) {
      return null
    }

    return schedule
  }

  async create(data: Prisma.ScheduleUncheckedCreateInput) {
    const schedule = {
      id: randomUUID(),
      monOpeningTime: data.monOpeningTime || null,
      tueOpeningTime: data.tueOpeningTime || null,
      wedOpeningTime: data.wedOpeningTime || null,
      thuOpeningTime: data.thuOpeningTime || null,
      friOpeningTime: data.friOpeningTime || null,
      satOpeningTime: data.satOpeningTime || null,
      sunOpeningTime: data.sunOpeningTime || null,
      monClosingTime: data.monClosingTime || null,
      tueClosingTime: data.tueClosingTime || null,
      wedClosingTime: data.wedClosingTime || null,
      thuClosingTime: data.thuClosingTime || null,
      friClosingTime: data.friClosingTime || null,
      satClosingTime: data.satClosingTime || null,
      sunClosingTime: data.sunClosingTime || null,
      establishmentId: data.establishmentId,
    }

    this.items.push(schedule)

    return schedule
  }
}
