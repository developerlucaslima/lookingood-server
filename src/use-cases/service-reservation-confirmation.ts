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
    // It should prevent service reservation confirmation if the reservation doesn't exist
    const reservation =
      await this.reservationsRepository.findById(reservationId)
    if (!reservation) {
      throw new ReservationNotFoundException()
    }

    // It should prevent service reservation confirmation if the establishment doesn't exist or doesn't match the reservation's establishment
    const establishment =
      await this.establishmentsRepository.findById(establishmentId)
    if (!establishment || establishment.id !== reservation.establishmentId) {
      throw new EstablishmentNotFoundException()
    }

    // It should allow service reservation confirmation
    reservation.status = `CONFIRMED`
    await this.reservationsRepository.update(reservation)
    return {
      reservation,
    }
  }
}
