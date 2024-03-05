import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryEstablishmentsRepository } from '@/repositories/in-memory/in-memory-establishments-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { AddScheduleUseCase } from '../factories/add-schedule'
import { InMemorySchedulesRepository } from '@/repositories/in-memory/in-memory-schedule-repository'
import { EstablishmentNotFoundError } from '../errors/establishment-not-found-error'
import { InvalidTimeFormatError } from '../errors/invalid-time-format-error'
import { OpeningOrClosingNotFoundError } from '../errors/opening-or-closing-not-found-error'
import { ScheduleTimesNotFoundError } from '../errors/schedule-times-not-found-error'

let schedulesRepository: InMemorySchedulesRepository
let establishmentsRepository: InMemoryEstablishmentsRepository
let sut: AddScheduleUseCase

describe('Add Schedule Use Case', () => {
  beforeEach(() => {
    establishmentsRepository = new InMemoryEstablishmentsRepository()
    schedulesRepository = new InMemorySchedulesRepository()
    sut = new AddScheduleUseCase(establishmentsRepository, schedulesRepository)

    establishmentsRepository.items.push({
      id: 'Barber-01',
      name: 'John Barber',
      description: 'Best barber of the city',
      phone: '55 555-5555',
      imageUrl: 'image.url',
      email: 'barber01@example.com',
      passwordHash: '123456',
      latitude: new Decimal(-27.2092052),
      longitude: new Decimal(-49.6401091),
      createdAt: new Date(),
    })
  })

  it('should to create schedule', async () => {
    const { schedule } = await sut.execute({
      monOpeningTime: '08:00',
      tueOpeningTime: '08:00',
      wedOpeningTime: '08:00',
      thuOpeningTime: '08:00',
      friOpeningTime: '08:00',
      satOpeningTime: '08:00',
      sunOpeningTime: null,
      monClosingTime: '20:00',
      tueClosingTime: '20:00',
      wedClosingTime: '20:00',
      thuClosingTime: '20:00',
      friClosingTime: '20:00',
      satClosingTime: '17:00',
      sunClosingTime: null,
      establishmentId: 'Barber-01',
    })
    expect(schedule.id).toEqual(expect.any(String))
  })

  it('should not be able to add schedule with nonexistent establishmentId', async () => {
    await expect(() =>
      sut.execute({
        monOpeningTime: '08:00',
        tueOpeningTime: '08:00',
        wedOpeningTime: '08:00',
        thuOpeningTime: '08:00',
        friOpeningTime: '08:00',
        satOpeningTime: '08:00',
        sunOpeningTime: null,
        monClosingTime: '20:00',
        tueClosingTime: '20:00',
        wedClosingTime: '20:00',
        thuClosingTime: '20:00',
        friClosingTime: '20:00',
        satClosingTime: '17:00',
        sunClosingTime: null,
        establishmentId: 'NonExistingEstablishment',
      }),
    ).rejects.toBeInstanceOf(EstablishmentNotFoundError)
  })

  it('should not be able to create a schedule with invalid time format', async () => {
    await expect(() =>
      sut.execute({
        monOpeningTime: '08:00',
        tueOpeningTime: '08:00',
        wedOpeningTime: '08:00',
        thuOpeningTime: '08:00',
        friOpeningTime: '08:00',
        satOpeningTime: '08:00',
        sunOpeningTime: null,
        monClosingTime: '20:00',
        tueClosingTime: '20:00',
        wedClosingTime: '20:00',
        thuClosingTime: '20:00',
        friClosingTime: '20:00',
        satClosingTime: '25:00', // Invalid time format
        sunClosingTime: null,
        establishmentId: 'Barber-01',
      }),
    ).rejects.toBeInstanceOf(InvalidTimeFormatError)
  })

  it('should not be able to create a schedule with only null values', async () => {
    await expect(() =>
      sut.execute({
        monOpeningTime: null,
        tueOpeningTime: null,
        wedOpeningTime: null,
        thuOpeningTime: null,
        friOpeningTime: null,
        satOpeningTime: null,
        sunOpeningTime: null,
        monClosingTime: null,
        tueClosingTime: null,
        wedClosingTime: null,
        thuClosingTime: null,
        friClosingTime: null,
        satClosingTime: null,
        sunClosingTime: null,
        establishmentId: 'Barber-01',
      }),
    ).rejects.toBeInstanceOf(ScheduleTimesNotFoundError)
  })

  it('should not be able to create a schedule with opening time but without a corresponding closing time, and vice versa', async () => {
    await expect(() =>
      sut.execute({
        monOpeningTime: '08:00',
        tueOpeningTime: null,
        wedOpeningTime: '08:00',
        thuOpeningTime: '08:00',
        friOpeningTime: '08:00',
        satOpeningTime: '08:00',
        sunOpeningTime: '08:00',
        monClosingTime: null,
        tueClosingTime: '20:00',
        wedClosingTime: '20:00',
        thuClosingTime: '20:00',
        friClosingTime: '20:00',
        satClosingTime: '20:00',
        sunClosingTime: '20:00',
        establishmentId: 'Barber-01',
      }),
    ).rejects.toBeInstanceOf(OpeningOrClosingNotFoundError)
  })
})
