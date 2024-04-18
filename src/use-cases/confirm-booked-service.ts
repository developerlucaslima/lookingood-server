import { Booking } from '@prisma/client'
import { BookingsRepository } from '@/repositories/bookings-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { EstablishmentNotFoundError } from './errors/establishment-not-found-error'
import { EstablishmentsRepository } from '@/repositories/establishments-repository'

interface ConfirmBookedServiceUseCaseRequest {
  bookingId: string
  establishmentId: string
}

interface ConfirmBookedServicesUseCaseResponse {
  booking: Booking
}

export class ConfirmBookedServiceUseCase {
  constructor(
    private bookingsRepository: BookingsRepository,
    private establishmentsRepository: EstablishmentsRepository,
  ) {}

  async execute({
    bookingId,
    establishmentId,
  }: ConfirmBookedServiceUseCaseRequest): Promise<ConfirmBookedServicesUseCaseResponse> {
    const booking = await this.bookingsRepository.findById(bookingId)

    if (!booking) {
      throw new ResourceNotFoundError()
    }

    const establishment =
      await this.establishmentsRepository.findById(establishmentId)
    if (!establishment || establishment.id !== booking.establishmentId) {
      throw new EstablishmentNotFoundError()
    }

    booking.status = `Confirmed`

    await this.bookingsRepository.update(booking)

    return {
      booking,
    }
  }
}
