import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryEstablishmentsRepository } from '@/repositories/in-memory/in-memory-establishments-repository'
import { InMemoryProfessionalsRepository } from '@/repositories/in-memory/in-memory-professionals-repository'
import { InMemoryServicesRepository } from '@/repositories/in-memory/in-memory-services-repository'
import { InMemoryReservationsRepository } from '@/repositories/in-memory/in-memory-reservations-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { ServiceReservationUseCase } from '@/use-cases/service-reservation'
import { InMemoryProfessionalsSchedulesRepository } from '@/repositories/in-memory/in-memory-professionals-schedules-repository'
import { ProfessionalNotFoundException } from '@/use-cases/errors/404-professional-not-found-exception'
import { ResourceNotFoundException } from '@/use-cases/errors/404-resource-not-found-exception'
import { ServiceNotFoundException } from '@/use-cases/errors/404-service-not-found-exception'
import { TimetableNotAvailableException } from '@/use-cases/errors/409-timetable-not-available-exception'
import { Decimal } from '@prisma/client/runtime/library'
import { hash } from 'bcryptjs'
import { WeekDay } from '@prisma/client'
import { UnauthorizedUserException } from '@/use-cases/errors/401-unauthorized-user-exception'
import { EstablishmentNotFoundException } from '@/use-cases/errors/404-establishment-not-found-exception'

let establishmentsRepository: InMemoryEstablishmentsRepository
let professionalsRepository: InMemoryProfessionalsRepository
let professionalSchedulesRepository: InMemoryProfessionalsSchedulesRepository
let servicesRepository: InMemoryServicesRepository
let reservationsRepository: InMemoryReservationsRepository
let usersRepository: InMemoryUsersRepository
let sut: ServiceReservationUseCase

describe('Service Reservation Use Case', () => {
  beforeEach(async () => {
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
        professionalId: 'Nonexistent-Professional-01', // invalid professional
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
        serviceId: 'Nonexistent-Service-01', // invalid service
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
        userId: 'Nonexistent-User-01', // invalid user
        establishmentId: 'Establishment-01',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedUserException)
  })

  it('should prevent service reservation if establishment does not exist', async () => {
    await expect(
      sut.execute({
        startTime: new Date(2024, 1, 1, 11, 0, 0),
        professionalId: 'Professional-01',
        serviceId: 'Service-01',
        userId: 'User-01',
        establishmentId: 'Nonexistent-Establishment-01', // invalid establishment
      }),
    ).rejects.toBeInstanceOf(EstablishmentNotFoundException)
  })

  it('should prevent service reservation if the establishment, professional and service does not match', async () => {
    await expect(
      sut.execute({
        startTime: new Date(2024, 1, 1, 11, 0, 0),
        professionalId: 'Professional-02', // invalid professional
        serviceId: 'Service-01',
        userId: 'User-01',
        establishmentId: 'Establishment-01',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundException)
  })

  it("should prevent service reservation if there are conflicts in the professional's schedule", async () => {
    await expect(
      sut.execute({
        startTime: new Date(2024, 1, 1, 9, 0, 0), // invalid time
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
