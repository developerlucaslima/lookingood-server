import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { ServiceReservationUpdateUseCase } from '@/use-cases/service-reservation-update'
import { InMemoryEstablishmentsRepository } from '@/repositories/in-memory/in-memory-establishments-repository'
import { InMemoryProfessionalsRepository } from '@/repositories/in-memory/in-memory-professionals-repository'
import { InMemoryProfessionalsSchedulesRepository } from '@/repositories/in-memory/in-memory-professionals-schedules-repository'
import { InMemoryServicesRepository } from '@/repositories/in-memory/in-memory-services-repository'
import { InMemoryReservationsRepository } from '@/repositories/in-memory/in-memory-reservations-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { ServiceNotFoundException } from '@/use-cases/errors/404-service-not-found-exception'
import { ReservationNotFoundException } from '@/use-cases/errors/404-reservation-not-found-exception'
import { ModificationDeadlineExceededError } from '@/use-cases/errors/422-modification-deadline-exceeded-exception'
import { ProfessionalNotFoundException } from '@/use-cases/errors/404-professional-not-found-exception'
import { ResourceNotFoundException } from '@/use-cases/errors/404-resource-not-found-exception'
import { TimetableNotAvailableException } from '@/use-cases/errors/409-timetable-not-available-exception'
import { WeekDay } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import { hash } from 'bcryptjs'
import { UnauthorizedUserException } from '@/use-cases/errors/401-unauthorized-user-exception'

describe('Service Reservation Update Use Case', () => {
  let establishmentsRepository: InMemoryEstablishmentsRepository
  let professionalsRepository: InMemoryProfessionalsRepository
  let professionalSchedulesRepository: InMemoryProfessionalsSchedulesRepository
  let servicesRepository: InMemoryServicesRepository
  let reservationsRepository: InMemoryReservationsRepository
  let usersRepository: InMemoryUsersRepository
  let sut: ServiceReservationUpdateUseCase

  beforeEach(async () => {
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

    // Professional 01 -------------------
    const professionalId = 'Professional-01'
    professionalsRepository.items.set(professionalId, {
      id: professionalId,
      name: 'Registered Professional',
      imageUrl: 'image.url',
      establishmentId: 'Establishment-01',
    })

    // Professional 02 -------------------
    const professionalId02 = 'Professional-02'
    professionalsRepository.items.set(professionalId02, {
      id: professionalId02,
      name: 'Registered Professional',
      imageUrl: 'image.url',
      establishmentId: 'Establishment-02',
    })

    const professionalSchedule = [
      { weekDay: 'MONDAY' as WeekDay, id: 'Monday-Schedule' },
      { weekDay: 'TUESDAY' as WeekDay, id: 'Tuesday-Schedule' },
      { weekDay: 'WEDNESDAY' as WeekDay, id: 'Wednesday-Schedule' },
      { weekDay: 'THURSDAY' as WeekDay, id: 'Thursday-Schedule' },
      { weekDay: 'FRIDAY' as WeekDay, id: 'Friday-Schedule' },
      { weekDay: 'SATURDAY' as WeekDay, id: 'Saturday-Schedule' },
      // { weekDay: 'SUNDAY' as WeekDay, id: 'Sunday-Schedule' },
    ]

    // Professional Schedule 01 -------------------
    professionalSchedule.forEach(({ weekDay, id }) => {
      professionalSchedulesRepository.items.set(id + '-01', {
        id: id + '-01',
        startTime: '08:00',
        minutesWorking: 600,
        breakTime: '12:00',
        minutesBreak: 60,
        weekDay,
        professionalId,
      })
    })

    // Professional Schedule 02 -------------------
    professionalSchedule.forEach(({ weekDay, id }) => {
      professionalSchedulesRepository.items.set(id + '-02', {
        id: id + '-02',
        startTime: '08:00',
        minutesWorking: 600,
        breakTime: '12:00',
        minutesBreak: 60,
        weekDay,
        professionalId: professionalId02,
      })
    })

    // Service 01 -------------------
    const serviceId = 'Service-01'
    servicesRepository.items.set(serviceId, {
      id: serviceId,
      name: 'Service-01',
      price: new Decimal(50),
      genderFor: 'BOTH',
      description: 'Registered Service',
      imageUrl: 'image.url',
      modificationDeadlineMinutes: 60,
      establishmentId: 'Establishment-01',
      durationMinutes: 45,
    })

    // User 01 -------------------
    const userId = 'User-01'
    usersRepository.items.set(userId, {
      id: userId,
      name: 'Registered User',
      serviceGender: 'BOTH',
      email: 'registered_user@example.com',
      passwordHash: await hash('123456', 6),
      createdAt: new Date(),
      role: 'USER',
    })

    // Reservation 01 -------------------
    const reservationId = 'Reservation-01'
    reservationsRepository.items.set(reservationId, {
      id: reservationId,
      status: 'WAITING_FOR_CONFIRMATION',
      startTime: new Date(2024, 1, 1, 9, 0, 0),
      endTime: new Date(2024, 1, 1, 9, 45, 0),
      professionalId: 'Professional-01',
      serviceId: 'Service-01',
      userId: 'User-01',
      establishmentId: 'Establishment-01',
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should allow service reservation update', async () => {
    vi.setSystemTime(new Date(2024, 1, 1, 7, 0, 0))

    const { reservation } = await sut.execute({
      startTime: new Date(2024, 1, 1, 11, 0, 0),
      userId: 'User-01',
      serviceId: 'Service-01',
      professionalId: 'Professional-01',
      reservationId: 'Reservation-01',
    })

    expect(reservation.id).toEqual(expect.any(String))
  })

  it('should prevent service reservation update if the reservation does not exist', async () => {
    vi.setSystemTime(new Date(2024, 1, 1, 7, 0, 0))

    await expect(
      sut.execute({
        startTime: new Date(2024, 1, 1, 11, 0, 0),
        userId: 'User-01',
        serviceId: 'Service-01',
        professionalId: 'Professional-01',
        reservationId: 'Nonexistent-Reservation-01', // invalid reservation
      }),
    ).rejects.toBeInstanceOf(ReservationNotFoundException)
  })

  it('should prevent service reservation update if the user does not exist', async () => {
    vi.setSystemTime(new Date(2024, 1, 1, 7, 0, 0))

    await expect(
      sut.execute({
        startTime: new Date(2024, 1, 1, 11, 0, 0),
        userId: 'Nonexistent-User-01', // invalid user
        serviceId: 'Service-01',
        professionalId: 'Professional-01',
        reservationId: 'Reservation-01',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedUserException)
  })

  it('should prevent service reservation update if the user does not match the reservation', async () => {
    vi.setSystemTime(new Date(2024, 1, 1, 7, 0, 0))

    await expect(
      sut.execute({
        startTime: new Date(2024, 1, 1, 11, 0, 0),
        userId: 'User-02', // invalid user
        serviceId: 'Service-01',
        professionalId: 'Professional-01',
        reservationId: 'Reservation-01',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedUserException)
  })

  it('should prevent service reservation update if the service does not exist', async () => {
    vi.setSystemTime(new Date(2024, 1, 1, 7, 0, 0))

    await expect(
      sut.execute({
        startTime: new Date(2024, 1, 1, 11, 0, 0),
        userId: 'User-01',
        serviceId: 'Nonexistent-Service-01', // invalid service
        professionalId: 'Professional-01',
        reservationId: 'Reservation-01',
      }),
    ).rejects.toBeInstanceOf(ServiceNotFoundException)
  })

  it('should prevent service reservation update if it is not within the modification deadline', async () => {
    vi.setSystemTime(new Date(2024, 1, 1, 10, 30, 0)) // invalid deadline

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
    vi.setSystemTime(new Date(2024, 1, 1, 7, 0, 0))

    await expect(
      sut.execute({
        startTime: new Date(2024, 1, 1, 11, 0, 0),
        userId: 'User-01',
        serviceId: 'Service-01',
        professionalId: 'Nonexistent-Professional-01', // invalid professional
        reservationId: 'Reservation-01',
      }),
    ).rejects.toBeInstanceOf(ProfessionalNotFoundException)
  })

  it('should prevent service reservation update if the establishment, professional and service does not match', async () => {
    vi.setSystemTime(new Date(2024, 1, 1, 7, 0, 0))

    await expect(
      sut.execute({
        startTime: new Date(2024, 1, 1, 11, 0, 0),
        userId: 'User-01',
        serviceId: 'Service-01',
        professionalId: 'Professional-02', // invalid professional
        reservationId: 'Reservation-01',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundException)
  })

  it("should prevent service reservation update if there are conflicts in the professional's schedule", async () => {
    vi.setSystemTime(new Date(2024, 1, 1, 7, 0, 0))

    await expect(
      sut.execute({
        startTime: new Date(2024, 1, 1, 9, 0, 0), // invalid time
        userId: 'User-01',
        serviceId: 'Service-01',
        professionalId: 'Professional-01',
        reservationId: 'Reservation-01',
      }),
    ).rejects.toBeInstanceOf(TimetableNotAvailableException)
  })

  it('should prevent service reservation update if the professional does not have operating hours for the given time', async () => {
    vi.setSystemTime(new Date(2024, 1, 1, 7, 0, 0))

    await expect(
      sut.execute({
        startTime: new Date(2024, 1, 1, 5, 0, 0), // invalid time
        userId: 'User-01',
        serviceId: 'Service-01',
        professionalId: 'Professional-01',
        reservationId: 'Reservation-01',
      }),
    ).rejects.toBeInstanceOf(TimetableNotAvailableException)
  })
})
