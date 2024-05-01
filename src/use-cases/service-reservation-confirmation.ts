import { EstablishmentsRepository } from '@/repositories/establishments-repository'
import { ReservationsRepository } from '@/repositories/reservations-repository'
import { Reservation } from '@prisma/client'
import { ReservationNotFoundException } from './errors/404-reservation-not-found-exception'
import { UnauthorizedEstablishmentException } from './errors/401-unauthorized-establishment-exception'

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
    // It should prevent service reservation confirmation if the reservation does not exist
    const reservation =
      await this.reservationsRepository.findById(reservationId)
    if (!reservation) {
      throw new ReservationNotFoundException()
    }

    // It should prevent service confirmation update if the establishment does not exist
    const establishment =
      await this.establishmentsRepository.findById(establishmentId)
    if (!establishment) {
      throw new UnauthorizedEstablishmentException('unauthenticated')
    }

    // It should prevent service reservation confirmation if the establishment does not match the reservation
    if (establishmentId !== reservation.establishmentId) {
      throw new UnauthorizedEstablishmentException('unauthorized')
    }

    // It should allow service reservation confirmation.
    reservation.status = 'CONFIRMED'
    await this.reservationsRepository.update(reservation)
    return {
      reservation,
    }
  }
}
