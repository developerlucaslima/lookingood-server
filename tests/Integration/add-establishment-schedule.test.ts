import { InMemoryEstablishmentsRepository } from '@/repositories/in-memory/in-memory-establishments-repository'
import { InMemoryEstablishmentsSchedulesRepository } from '@/repositories/in-memory/in-memory-establishments-schedules-repository'
import { AddEstablishmentScheduleUseCase } from '@/use-cases/add-establishment-schedule'
import { InvalidInputParametersException } from '@/use-cases/errors/400-invalid-input-parameters-exception'
import { EstablishmentNotFoundException } from '@/use-cases/errors/404-establishment-not-found-exception'
import { Decimal } from '@prisma/client/runtime/library'
import { hash } from 'bcryptjs'
import { beforeEach, it, expect, describe } from 'vitest'

let establishmentsRepository: InMemoryEstablishmentsRepository
let establishmentSchedulesRepository: InMemoryEstablishmentsSchedulesRepository
let sut: AddEstablishmentScheduleUseCase

describe('Add Establishment Schedule Use Case', () => {
  beforeEach(async () => {
    establishmentsRepository = new InMemoryEstablishmentsRepository()
    establishmentSchedulesRepository =
      new InMemoryEstablishmentsSchedulesRepository()
    sut = new AddEstablishmentScheduleUseCase(
      establishmentsRepository,
      establishmentSchedulesRepository,
    )

    // Establishment 01 -------------------
    const establishmentId = 'Establishment-01'
    establishmentsRepository.items.set(establishmentId, {
      id: establishmentId,
      name: 'Registered Establishment',
      description: 'Registered establishment...',
      phone: '55 555-5555',
      imageUrl: 'image.url',
      email: 'registered_establishment@example.com',
      passwordHash: await hash('123456', 6),
      createdAt: new Date(),
      latitude: new Decimal(-27.2092052),
      longitude: new Decimal(-49.6401091),
      role: 'ESTABLISHMENT',
    })
  })

  it('should allow add a establishment schedule', async () => {
    const { schedule } = await sut.execute({
      startTime: '08:00',
      minutesWorking: 480,
      breakTime: '12:00',
      minutesBreak: 90,
      weekDay: 'MONDAY',
      establishmentId: 'Establishment-01',
    })

    expect(schedule.id).toEqual(expect.any(String))
  })

  it('should prevent add professional schedule with negative time parameters', async () => {
    await expect(() =>
      sut.execute({
        startTime: '08:00',
        minutesWorking: -480, // invalid minutes
        breakTime: '12:00',
        minutesBreak: 90,
        weekDay: 'MONDAY',
        establishmentId: 'Establishment-01',
      }),
    ).rejects.toBeInstanceOf(InvalidInputParametersException)
  })

  it('should prevent to add establishment schedule if the establishment does not exist', async () => {
    await expect(() =>
      sut.execute({
        startTime: '08:00',
        minutesWorking: 480,
        breakTime: '12:00',
        minutesBreak: 90,
        weekDay: 'MONDAY',
        establishmentId: 'Nonexistent-Establishment-01', // invalid establishment
      }),
    ).rejects.toBeInstanceOf(EstablishmentNotFoundException)
  })
})
