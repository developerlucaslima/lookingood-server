import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryEstablishmentsRepository } from '@/repositories/in-memory/in-memory-establishments-repository'
import { InMemoryProfessionalsRepository } from '@/repositories/in-memory/in-memory-professionals-repository'
import { InMemoryServicesRepository } from '@/repositories/in-memory/in-memory-services-repository'
import { InMemoryReservationsRepository } from '@/repositories/in-memory/in-memory-reservations-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { ServiceReservationUseCase } from '@/use-cases/service-reservation'
import { servicesSetup } from 'tests/setup/services-setup'
import { usersSetup } from 'tests/setup/users-setup'
import { establishmentsSetup } from 'tests/setup/establishments-setup'
import { professionalsSetup } from 'tests/setup/professionals-setup'
import { professionalsSchedulesSetup } from 'tests/setup/professionals-schedules-setup'
import { InMemoryProfessionalsSchedulesRepository } from '@/repositories/in-memory/in-memory-professionals-schedules-repository'
import { reservationsSetup } from 'tests/setup/reservations-setup'
import { EstablishmentNotFoundException } from '@/use-cases/errors/404-establishment-not-found-exception'
import { ProfessionalNotFoundException } from '@/use-cases/errors/404-professional-not-found-exception'
import { ResourceNotFoundException } from '@/use-cases/errors/404-resource-not-found-exception'
import { ServiceNotFoundException } from '@/use-cases/errors/404-service-not-found-exception'
import { UserNotFoundException } from '@/use-cases/errors/404-user-not-found-exception'
import { TimetableNotAvailableException } from '@/use-cases/errors/409-timetable-not-available-exception'

let establishmentsRepository: InMemoryEstablishmentsRepository
let professionalsRepository: InMemoryProfessionalsRepository
let professionalSchedulesRepository: InMemoryProfessionalsSchedulesRepository
let servicesRepository: InMemoryServicesRepository
let reservationsRepository: InMemoryReservationsRepository
let usersRepository: InMemoryUsersRepository
let sut: ServiceReservationUseCase

describe('Service Reservation Use Case', () => {
  beforeEach(() => {
    establishmentsRepository = new InMemoryEstablishmentsRepository()
    professionalsRepository = new InMemoryProfessionalsRepository()
    professionalSchedulesRepository =
      new InMemoryProfessionalsSchedulesRepository()
    servicesRepository = new InMemoryServicesRepository()
    reservationsRepository = new InMemoryReservationsRepository()
    usersRepository = new InMemoryUsersRepository()

    sut = new ServiceReservationUseCase(
      establishmentsRepository,
      professionalsRepository,
      professionalSchedulesRepository,
      servicesRepository,
      reservationsRepository,
      usersRepository,
    )

    establishmentsSetup(establishmentsRepository)
    professionalsSetup(professionalsRepository)
    professionalsSchedulesSetup(professionalSchedulesRepository)
    servicesSetup(servicesRepository)
    usersSetup(usersRepository)
    reservationsSetup(reservationsRepository)
  })

  it('should allow service reservation', async () => {
    const { reservation } = await sut.execute({
      startTime: new Date(2024, 1, 1, 11, 0, 0),
      professionalId: 'Professional-01',
      serviceId: 'Service-01',
      userId: 'User-01',
      establishmentId: 'Establishment-01',
    })

    expect(reservation.id).toEqual(expect.any(String))
  })

  it('should prevent service reservation if professional does not exist', async () => {
    await expect(
      sut.execute({
        startTime: new Date(2024, 1, 1, 11, 0, 0),
        professionalId: 'Nonexistent-Professional-01',
        serviceId: 'Service-01',
        userId: 'User-01',
        establishmentId: 'Establishment-01',
      }),
    ).rejects.toBeInstanceOf(ProfessionalNotFoundException)
  })

  it('should prevent service reservation if service does not exist', async () => {
    await expect(
      sut.execute({
        startTime: new Date(2024, 1, 1, 11, 0, 0),
        professionalId: 'Professional-01',
        serviceId: 'Nonexistent-Service-01',
        userId: 'User-01',
        establishmentId: 'Establishment-01',
      }),
    ).rejects.toBeInstanceOf(ServiceNotFoundException)
  })

  it('should prevent service reservation if user does not exist', async () => {
    await expect(
      sut.execute({
        startTime: new Date(2024, 1, 1, 11, 0, 0),
        professionalId: 'Professional-01',
        serviceId: 'Service-01',
        userId: 'Nonexistent-User-01',
        establishmentId: 'Establishment-01',
      }),
    ).rejects.toBeInstanceOf(UserNotFoundException)
  })

  it('should prevent service reservation if establishment does not exist', async () => {
    await expect(
      sut.execute({
        startTime: new Date(2024, 1, 1, 11, 0, 0),
        professionalId: 'Professional-01',
        serviceId: 'Service-01',
        userId: 'User-01',
        establishmentId: 'Nonexistent-Establishment-01',
      }),
    ).rejects.toBeInstanceOf(EstablishmentNotFoundException)
  })

  it('should prevent service reservation if the establishment or professional does not match the service', async () => {
    await expect(
      sut.execute({
        startTime: new Date(2024, 1, 1, 11, 0, 0),
        professionalId: 'Professional-01',
        serviceId: 'Service-01',
        userId: 'User-01',
        establishmentId: 'Establishment-02',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundException)
  })

  it("should prevent service reservation if there are conflicts in the professional's schedule", async () => {
    await expect(
      sut.execute({
        startTime: new Date(2024, 1, 1, 9, 0, 0),
        professionalId: 'Professional-01',
        serviceId: 'Service-01',
        userId: 'User-01',
        establishmentId: 'Establishment-01',
      }),
    ).rejects.toBeInstanceOf(TimetableNotAvailableException)
  })

  it('should prevent service reservation if the professional does not have operating hours for the given time', async () => {
    await expect(
      sut.execute({
        startTime: new Date(2024, 1, 1, 5, 0, 0),
        professionalId: 'Professional-01',
        serviceId: 'Service-01',
        userId: 'User-01',
        establishmentId: 'Establishment-01',
      }),
    ).rejects.toBeInstanceOf(TimetableNotAvailableException)
  })
})
