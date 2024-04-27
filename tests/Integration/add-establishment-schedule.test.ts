import { InMemoryEstablishmentsRepository } from '@/repositories/in-memory/in-memory-establishments-repository'
import { InMemoryEstablishmentsSchedulesRepository } from '@/repositories/in-memory/in-memory-establishments-schedules-repository'
import { AddEstablishmentScheduleUseCase } from '@/use-cases/add-establishment-schedule'
import { InvalidInputParametersException } from '@/use-cases/errors/400-invalid-input-parameters-exception'
import { EstablishmentNotFoundException } from '@/use-cases/errors/404-establishment-not-found-exception'
import { establishmentsSetup } from 'tests/setup/establishments-setup'
import { beforeEach, it, expect, describe } from 'vitest'

let establishmentsRepository: InMemoryEstablishmentsRepository
let establishmentSchedulesRepository: InMemoryEstablishmentsSchedulesRepository
let sut: AddEstablishmentScheduleUseCase

describe('Add Establishment Schedule Use Case', () => {
  beforeEach(() => {
    establishmentsRepository = new InMemoryEstablishmentsRepository()
    establishmentSchedulesRepository =
      new InMemoryEstablishmentsSchedulesRepository()
    sut = new AddEstablishmentScheduleUseCase(
      establishmentsRepository,
      establishmentSchedulesRepository,
    )

    establishmentsSetup(establishmentsRepository)
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
