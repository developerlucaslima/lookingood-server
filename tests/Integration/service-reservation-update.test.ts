import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { ServiceReservationUpdateUseCase } from '@/use-cases/service-reservation-update'
import { InMemoryEstablishmentsRepository } from '@/repositories/in-memory/in-memory-establishments-repository'
import { InMemoryProfessionalsRepository } from '@/repositories/in-memory/in-memory-professionals-repository'
import { InMemoryProfessionalsSchedulesRepository } from '@/repositories/in-memory/in-memory-professionals-schedules-repository'
import { InMemoryServicesRepository } from '@/repositories/in-memory/in-memory-services-repository'
import { InMemoryReservationsRepository } from '@/repositories/in-memory/in-memory-reservations-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { ServiceNotFoundException } from '@/use-cases/errors/404-service-not-found-exception'
import { UserNotFoundException } from '@/use-cases/errors/404-user-not-found-exception'
import { ReservationNotFoundException } from '@/use-cases/errors/404-reservation-not-found-exception'
import { ModificationDeadlineExceededError } from '@/use-cases/errors/422-modification-deadline-exceeded-exception'
import { ProfessionalNotFoundException } from '@/use-cases/errors/404-professional-not-found-exception'
import { EstablishmentNotFoundException } from '@/use-cases/errors/404-establishment-not-found-exception'
import { ResourceNotFoundException } from '@/use-cases/errors/404-resource-not-found-exception'
import { TimetableNotAvailableException } from '@/use-cases/errors/409-timetable-not-available-exception'

describe('Service Reservation Update Use Case', () => {
  let establishmentsRepository: InMemoryEstablishmentsRepository
  let professionalsRepository: InMemoryProfessionalsRepository
  let professionalSchedulesRepository: InMemoryProfessionalsSchedulesRepository
  let servicesRepository: InMemoryServicesRepository
  let reservationsRepository: InMemoryReservationsRepository
  let usersRepository: InMemoryUsersRepository
  let sut: ServiceReservationUpdateUseCase

  beforeEach(() => {
    establishmentsRepository = new InMemoryEstablishmentsRepository()
    professionalsRepository = new InMemoryProfessionalsRepository()
    professionalSchedulesRepository =
      new InMemoryProfessionalsSchedulesRepository()
    servicesRepository = new InMemoryServicesRepository()
    reservationsRepository = new InMemoryReservationsRepository()
    usersRepository = new InMemoryUsersRepository()

    sut = new ServiceReservationUpdateUseCase(
      establishmentsRepository,
      professionalsRepository,
      professionalSchedulesRepository,
      servicesRepository,
      reservationsRepository,
      usersRepository,
    )

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should allow service reservation update', async () => {
    const { reservation } = await sut.execute({
      startTime: new Date(2024, 1, 1, 11, 0, 0),
      userId: 'User-01',
      serviceId: 'Service-01',
      professionalId: 'Professional-01',
      reservationId: 'Reservation-01',
    })

    expect(reservation.status).toEqual(expect.any('WAITING_FOR_CONFIRMATION'))
  })

  it('should prevent service reservation update if the reservation does not exist', async () => {
    await expect(
      sut.execute({
        startTime: new Date(2024, 1, 1, 11, 0, 0),
        userId: 'User-01',
        serviceId: 'Service-01',
        professionalId: 'Professional-01',
        reservationId: 'Nonexistent-Reservation-01',
      }),
    ).rejects.toBeInstanceOf(ReservationNotFoundException)
  })

  it('should prevent service reservation update if the user does not exist', async () => {
    await expect(
      sut.execute({
        startTime: new Date(2024, 1, 1, 11, 0, 0),
        userId: 'Nonexistent-User-01',
        serviceId: 'Service-01',
        professionalId: 'Professional-01',
        reservationId: 'Reservation-01',
      }),
    ).rejects.toBeInstanceOf(UserNotFoundException)
  })

  it('should prevent service reservation update if the user does not match the reservation', async () => {
    await expect(
      sut.execute({
        startTime: new Date(2024, 1, 1, 11, 0, 0),
        userId: 'User-02',
        serviceId: 'Service-01',
        professionalId: 'Professional-01',
        reservationId: 'Reservation-01',
      }),
    ).rejects.toBeInstanceOf(UserNotFoundException)
  })

  it('should prevent service reservation update if the service does not exist', async () => {
    await expect(
      sut.execute({
        startTime: new Date(2024, 1, 1, 11, 0, 0),
        userId: 'User-02',
        serviceId: 'Nonexistent-Service-01',
        professionalId: 'Professional-01',
        reservationId: 'Reservation-01',
      }),
    ).rejects.toBeInstanceOf(ServiceNotFoundException)
  })

  it('should prevent service reservation update if it is not within the modification deadline', async () => {
    vi.setSystemTime(new Date(2024, 1, 1, 10, 30, 0))

    await expect(
      sut.execute({
        startTime: new Date(2024, 1, 1, 11, 0, 0),
        userId: 'User-01',
        serviceId: 'Service-01',
        professionalId: 'Professional-01',
        reservationId: 'Reservation-01',
      }),
    ).rejects.toBeInstanceOf(ModificationDeadlineExceededError)
  })

  it('should prevent service reservation update if the professional does not exist', async () => {
    await expect(
      sut.execute({
        startTime: new Date(2024, 1, 1, 11, 0, 0),
        userId: 'User-01',
        serviceId: 'Service-01',
        professionalId: 'Nonexistent-Professional-01',
        reservationId: 'Reservation-01',
      }),
    ).rejects.toBeInstanceOf(ProfessionalNotFoundException)
  })

  it('should prevent service reservation update if the establishment does not exist', async () => {
    await expect(
      sut.execute({
        startTime: new Date(2024, 1, 1, 11, 0, 0),
        userId: 'User-01',
        serviceId: 'Service-01',
        professionalId: 'Nonexistent-Professional-01',
        reservationId: 'Reservation-01',
      }),
    ).rejects.toBeInstanceOf(EstablishmentNotFoundException)
  })

  it("should prevent service reservation update if the service's establishment does not match the professional's", async () => {
    await expect(
      sut.execute({
        startTime: new Date(2024, 1, 1, 11, 0, 0),
        userId: 'User-01',
        serviceId: 'Service-01',
        professionalId: 'Professional-02',
        reservationId: 'Reservation-01',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundException)
  })

  it("should prevent service reservation update if there is a conflict in the professional's schedule", async () => {
    await expect(
      sut.execute({
        startTime: new Date(2024, 1, 1, 9, 0, 0),
        userId: 'User-01',
        serviceId: 'Service-01',
        professionalId: 'Professional-01',
        reservationId: 'Reservation-01',
      }),
    ).rejects.toBeInstanceOf(TimetableNotAvailableException)
  })

  it('should prevent service reservation update if the professional does not have operating hours for the given time', async () => {
    await expect(
      sut.execute({
        startTime: new Date(2024, 1, 1, 5, 0, 0),
        userId: 'User-01',
        serviceId: 'Service-01',
        professionalId: 'Professional-01',
        reservationId: 'Reservation-01',
      }),
    ).rejects.toBeInstanceOf(TimetableNotAvailableException)
  })
})
