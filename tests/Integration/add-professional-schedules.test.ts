import { InMemoryEstablishmentsRepository } from '@/repositories/in-memory/in-memory-establishments-repository'
import { InMemoryEstablishmentsSchedulesRepository } from '@/repositories/in-memory/in-memory-establishments-schedules-repository'
import { InMemoryProfessionalsRepository } from '@/repositories/in-memory/in-memory-professionals-repository'
import { InMemoryProfessionalsSchedulesRepository } from '@/repositories/in-memory/in-memory-professionals-schedules-repository'
import { AddProfessionalScheduleUseCase } from '@/use-cases/add-professional-schedule'
import { InvalidInputParametersException } from '@/use-cases/errors/400-invalid-input-parameters-exception'
import { EstablishmentNotFoundException } from '@/use-cases/errors/404-establishment-not-found-exception'
import { ProfessionalNotFoundException } from '@/use-cases/errors/404-professional-not-found-exception'
import { ScheduleNotFoundException } from '@/use-cases/errors/404-schedule-not-found-exception'
import { InvalidEmployeeScheduleException } from '@/use-cases/errors/422-invalid-employee-schedule-exception'
import { establishmentsSetup } from 'tests/setup/establishments-setup'
import { professionalsSetup } from 'tests/setup/professionals-setup'
import { beforeEach, it, expect, describe } from 'vitest'

let professionalsRepository: InMemoryProfessionalsRepository
let professionalSchedulesRepository: InMemoryProfessionalsSchedulesRepository
let establishmentsRepository: InMemoryEstablishmentsRepository
let establishmentSchedulesRepository: InMemoryEstablishmentsSchedulesRepository
let sut: AddProfessionalScheduleUseCase

describe('Add Professional Schedule Use Case', () => {
  beforeEach(() => {
    professionalsRepository = new InMemoryProfessionalsRepository()
    establishmentsRepository = new InMemoryEstablishmentsRepository()
    professionalSchedulesRepository =
      new InMemoryProfessionalsSchedulesRepository()
    establishmentsRepository = new InMemoryEstablishmentsRepository()
    establishmentSchedulesRepository =
      new InMemoryEstablishmentsSchedulesRepository()
    sut = new AddProfessionalScheduleUseCase(
      professionalsRepository,
      professionalSchedulesRepository,
      establishmentsRepository,
      establishmentSchedulesRepository,
    )

    professionalsSetup(professionalsRepository)
    establishmentsSetup(establishmentsRepository)
  })

  it('should allow add a professional schedule', async () => {
    const { schedule } = await sut.execute({
      startTime: '08:00',
      minutesWorking: 480,
      breakTime: '12:00',
      minutesBreak: 90,
      weekDay: 'MONDAY',
      professionalId: 'Professional-01',
    })

    expect(schedule.id).toEqual(expect.any(String))
  })

  it('should prevent add professional schedule if the professional does not exist', async () => {
    await expect(() =>
      sut.execute({
        startTime: '08:00',
        minutesWorking: 480,
        breakTime: '12:00',
        minutesBreak: 90,
        weekDay: 'MONDAY',
        professionalId: 'Nonexistent-Professional-01', // invalid professional
      }),
    ).rejects.toBeInstanceOf(ProfessionalNotFoundException)
  })

  it('should prevent add professional schedule if the establishment does not exist', async () => {
    await expect(() =>
      sut.execute({
        startTime: '08:00',
        minutesWorking: 480,
        breakTime: '12:00',
        minutesBreak: 90,
        weekDay: 'MONDAY',
        professionalId: 'Professional-03', // professional from invalid establishment
      }),
    ).rejects.toBeInstanceOf(EstablishmentNotFoundException)
  })

  it('should prevent add professional schedule with negative time parameters', async () => {
    await expect(() =>
      sut.execute({
        startTime: '08:00',
        minutesWorking: -480, // invalid minutes
        breakTime: '12:00',
        minutesBreak: 90,
        weekDay: 'MONDAY',
        professionalId: 'Professional-01',
      }),
    ).rejects.toBeInstanceOf(InvalidInputParametersException)
  })

  it('should prevent add professional schedule if the establishment does not have opening hours for the given weekday', async () => {
    await expect(() =>
      sut.execute({
        startTime: '08:00',
        minutesWorking: 480,
        breakTime: '12:00',
        minutesBreak: 30,
        weekDay: 'SUNDAY', // invalid day for this establishment
        professionalId: 'Professional-01',
      }),
    ).rejects.toBeInstanceOf(ScheduleNotFoundException)
  })

  it('should prevent add professional schedule if the establishment does not have opening hours for the given weekday', async () => {
    await expect(() =>
      sut.execute({
        startTime: '01:00', // invalid schedule
        minutesWorking: 120,
        breakTime: '02:00',
        minutesBreak: 30,
        weekDay: 'SUNDAY',
        professionalId: 'Professional-01',
      }),
    ).rejects.toBeInstanceOf(InvalidEmployeeScheduleException)
  })
})
