import { EstablishmentsRepository } from '@/repositories/establishments-repository'
import { ReservationsRepository } from '@/repositories/reservations-repository'
import { Reservation } from '@prisma/client'
import { ReservationNotFoundException } from './errors/404-reservation-not-found-exception'
import { EstablishmentNotFoundException } from './errors/404-establishment-not-found-exception'

interface ServiceReservationConfirmationUseCaseRequest {
  reservationId: string
  establishmentId: string
}

interface ServiceReservationConfirmationsUseCaseResponse {
  reservation: Reservation
}

export class ServiceReservationConfirmationUseCase {
  constructor(
    private reservationsRepository: ReservationsRepository,
    private establishmentsRepository: EstablishmentsRepository,
  ) {}

  async execute({
    reservationId,
    establishmentId,
  }: ServiceReservationConfirmationUseCaseRequest): Promise<ServiceReservationConfirmationsUseCaseResponse> {
    // it should retrieve the reservation by its ID
    const reservation =
      await this.reservationsRepository.findById(reservationId)

    // it shouldn't be possible to confirm a reservation if the reservation doesn't exist
    if (!reservation) {
      throw new ReservationNotFoundException()
    }

    // it shouldn't be possible to confirm a reservation if the establishment doesn't exist or doesn't match the reservation's establishment
    const establishment =
      await this.establishmentsRepository.findById(establishmentId)
    if (!establishment || establishment.id !== reservation.establishmentId) {
      throw new EstablishmentNotFoundException()
    }

    // it should confirm the reservation
    reservation.status = `CONFIRMED`

    // it should update the reservation status
    await this.reservationsRepository.update(reservation)

    // it should return the confirmed reservation
    return {
      reservation,
    }
  }
}
