import { UsersRepository } from '@/repositories/users-repository'
import { Booking } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { BookingsRepository } from '@/repositories/bookings-repository'
import { ServicesRepository } from '@/repositories/services-repository'
import { EstablishmentsRepository } from '@/repositories/establishments-repository'
import { ProfessionalsRepository } from '@/repositories/professionals-repository'

interface BookingServiceUseCaseRequest {
  date: Date
  status: string
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
    status,
    userId,
    serviceId,
    professionalId,
  }: BookingServiceUseCaseRequest): Promise<BookingServicesUseCaseResponse> {
    // TODO: service and professional from the same establishment?
    // TODO: this establishment exits by id?
    // TODO: fazer esses testes
    // TODO: status, definir 3 status
    // TODO: nao deve ser possivel agendar com o mesmo profissional no mesmo horario

    const professional = await this.professionalsRepository.findById(serviceId)
    if (!professional) {
      throw new ResourceNotFoundError() // TODO: create specific error
    }

    const service = await this.servicesRepository.findById(serviceId)
    if (!service) {
      throw new ResourceNotFoundError() // TODO: create specific error
    }

    const user = await this.usersRepository.findById(userId)
    if (!user) {
      throw new ResourceNotFoundError() // TODO: create specific error
    }

    if (service.establishmentId !== professional.establishmentId) {
      throw new ResourceNotFoundError() // TODO: create specific error
    }

    const establishment = await this.establishmentsRepository.findById(
      service.establishmentId,
    )
    if (!establishment) {
      throw new ResourceNotFoundError()
    }

    // TODO: to think status names, to create only booked, to update can be anothers
    if (!['Booked', 'Confirmed', 'Check-Out', 'No-Show'].includes(status)) {
      throw new ResourceNotFoundError() // TODO: create specific error
    }

    const booking = await this.bookingsRepository.create({
      date,
      status,
      userId,
      serviceId,
      professionalId,
    })

    return {
      booking,
    }
  }
}
