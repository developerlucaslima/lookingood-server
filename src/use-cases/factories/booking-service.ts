import { UsersRepository } from '@/repositories/users-repository'
import { Booking } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { BookingsRepository } from '@/repositories/bookings-repository'
import { ServicesRepository } from '@/repositories/services-repository'
import { EstablishmentsRepository } from '@/repositories/establishments-repository'
import { ProfessionalsRepository } from '@/repositories/professionals-repository'
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error'
import { ServiceNotFoundError } from '../errors/service-not-found-error '
import { UserNotFoundError } from '../errors/user-not-found-error '
import { EstablishmentNotFoundError } from '../errors/establishment-not-found-error'
import { InvalidBookingStatusError } from '../errors/invalid-booking-status-error'

interface BookingServiceUseCaseRequest {
  date: Date
  userId: string
  serviceId: string
  professionalId: string
}

interface BookingServicesUseCaseResponse {
  booking: Booking
}

export class BookingServiceUseCase {
  constructor(
    private establishmentsRepository: EstablishmentsRepository,
    private professionalsRepository: ProfessionalsRepository,
    private servicesRepository: ServicesRepository,
    private bookingsRepository: BookingsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    date,
    userId,
    serviceId,
    professionalId,
  }: BookingServiceUseCaseRequest): Promise<BookingServicesUseCaseResponse> {
    const professional =
      await this.professionalsRepository.findById(professionalId)
    if (!professional) {
      throw new ProfessionalNotFoundError()
    }

    const service = await this.servicesRepository.findById(serviceId)
    if (!service) {
      throw new ServiceNotFoundError() // TODO: create specific error
    }

    const user = await this.usersRepository.findById(userId)
    if (!user) {
      throw new UserNotFoundError()
    }

    if (service.establishmentId !== professional.establishmentId) {
      throw new ResourceNotFoundError()
    }

    const establishment = await this.establishmentsRepository.findById(
      service.establishmentId,
    )
    if (!establishment) {
      throw new EstablishmentNotFoundError()
    }

    const booking = await this.bookingsRepository.create({
      date,
      status: 'Waiting for confirmation',
      userId,
      serviceId,
      professionalId,
    })

    if (booking.status !== 'Waiting for confirmation') {
      throw new InvalidBookingStatusError()
    }

    return {
      booking,
    }
  }
}
