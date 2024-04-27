import { expect, describe, it, beforeEach } from 'vitest'
import { ServiceReservationConfirmationUseCase } from '@/use-cases/service-reservation-confirmation'
import { InMemoryReservationsRepository } from '@/repositories/in-memory/in-memory-reservations-repository'
import { InMemoryEstablishmentsRepository } from '@/repositories/in-memory/in-memory-establishments-repository'
import { establishmentsSetup } from 'tests/setup/establishments-setup'
import { reservationsSetup } from 'tests/setup/reservations-setup'
import { ReservationNotFoundException } from '@/use-cases/errors/404-reservation-not-found-exception'
import { EstablishmentNotFoundException } from '@/use-cases/errors/404-establishment-not-found-exception'

let reservationsRepository: InMemoryReservationsRepository
let establishmentsRepository: InMemoryEstablishmentsRepository
let sut: ServiceReservationConfirmationUseCase

describe('Service Reservation Confirmation Use Case', () => {
  beforeEach(() => {
    reservationsRepository = new InMemoryReservationsRepository()
    establishmentsRepository = new InMemoryEstablishmentsRepository()
    sut = new ServiceReservationConfirmationUseCase(
      reservationsRepository,
      establishmentsRepository,
    )

    reservationsSetup(reservationsRepository)
    establishmentsSetup(establishmentsRepository)
  })

  it('should allow service reservation confirmation', async () => {
    const { reservation } = await sut.execute({
      reservationId: 'Reservation-01',
      establishmentId: 'Establishment-01',
    })

    expect(reservation.status).toEqual(expect.any('CONFIRMED'))
  })

  it("should prevent service reservation confirmation if the reservation doesn't exist", async () => {
    await expect(
      sut.execute({
        reservationId: 'Nonexistent-Reservation-01',
        establishmentId: 'Establishment-01',
      }),
    ).rejects.toBeInstanceOf(ReservationNotFoundException)
  })

  it("should prevent service reservation confirmation if the establishment doesn't exist or doesn't match the reservation's establishment", async () => {
    await expect(
      sut.execute({
        reservationId: 'Reservation-01',
        establishmentId: 'Nonexistent-Establishment-01',
      }),
    ).rejects.toBeInstanceOf(EstablishmentNotFoundException)
  })
})
