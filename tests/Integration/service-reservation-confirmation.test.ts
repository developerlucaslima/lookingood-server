import { expect, describe, it, beforeEach } from 'vitest'
import { ServiceReservationConfirmationUseCase } from '@/use-cases/service-reservation-confirmation'
import { InMemoryReservationsRepository } from '@/repositories/in-memory/in-memory-reservations-repository'
import { InMemoryEstablishmentsRepository } from '@/repositories/in-memory/in-memory-establishments-repository'
import { ReservationNotFoundException } from '@/use-cases/errors/404-reservation-not-found-exception'
import { Decimal } from '@prisma/client/runtime/library'
import { hash } from 'bcryptjs'
import { UnauthorizedEstablishmentException } from '@/use-cases/errors/401-unauthorized-establishment-exception'

let reservationsRepository: InMemoryReservationsRepository
let establishmentsRepository: InMemoryEstablishmentsRepository
let sut: ServiceReservationConfirmationUseCase

describe('Service Reservation Confirmation Use Case', () => {
  beforeEach(async () => {
    reservationsRepository = new InMemoryReservationsRepository()
    establishmentsRepository = new InMemoryEstablishmentsRepository()
    sut = new ServiceReservationConfirmationUseCase(
      reservationsRepository,
      establishmentsRepository,
    )

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

    // Establishment 02 -------------------
    const establishmentId02 = 'Establishment-02'
    establishmentsRepository.items.set(establishmentId02, {
      id: establishmentId02,
      name: 'Registered Establishment02',
      description: 'Registered establishment02...',
      phone: '55 555-5555',
      imageUrl: 'image.url',
      email: 'registered_establishment02@example.com',
      passwordHash: await hash('123456', 6),
      createdAt: new Date(),
      latitude: new Decimal(-27.2092052),
      longitude: new Decimal(-49.6401091),
      role: 'ESTABLISHMENT',
    })
  })

  it('should allow service reservation confirmation', async () => {
    const { reservation } = await sut.execute({
      reservationId: 'Reservation-01',
      establishmentId: 'Establishment-01',
    })

    expect(reservation.id).toEqual(expect.any(String))
  })

  it('should prevent service reservation confirmation if the reservation does not exist', async () => {
    await expect(
      sut.execute({
        reservationId: 'Nonexistent-Reservation-01', // invalid reservation
        establishmentId: 'Establishment-01',
      }),
    ).rejects.toBeInstanceOf(ReservationNotFoundException)
  })

  it('It should prevent service confirmation update if the establishment does not exist', async () => {
    await expect(
      sut.execute({
        reservationId: 'Reservation-01',
        establishmentId: 'Nonexistent-Establishment-01', // invalid establishment
      }),
    ).rejects.toBeInstanceOf(UnauthorizedEstablishmentException)
  })

  it('It should prevent service reservation confirmation if the establishment does not match the reservation', async () => {
    await expect(
      sut.execute({
        reservationId: 'Reservation-01',
        establishmentId: 'Establishment-02', // invalid establishment
      }),
    ).rejects.toBeInstanceOf(UnauthorizedEstablishmentException)
  })
})
