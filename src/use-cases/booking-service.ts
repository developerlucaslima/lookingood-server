import { UsersRepository } from '@/repositories/users-repository'
import { Booking } from '@prisma/client'
import { BookingsRepository } from '@/repositories/bookings-repository'
import { EstablishmentsRepository } from '@/repositories/establishments-repository'
import { ProfessionalsRepository } from '@/repositories/professionals-repository'
import { SchedulesRepository } from '@/repositories/schedules-repository'
import { ServicesRepository } from '@/repositories/services-repository'
import { checkOperatingHours } from '@/utils/check-operating-hours'
import { getDayOfWeekName } from '@/utils/get-day-of-week-name'
import { getEndTimeByStartTime } from '@/utils/get-end-time-by-start-time'
import { EstablishmentNotFoundError } from '@/use-cases/errors/establishment-not-found-error'
import { HourNotAvailable } from '@/use-cases/errors/hour-not-available'
import { InvalidTimetableError } from '@/use-cases/errors/invalid-timetable-error'
import { ProfessionalNotFoundError } from '@/use-cases/errors/professional-not-found-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { ServiceNotFoundError } from '@/use-cases/errors/service-not-found-error '
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error '

interface BookingServiceUseCaseRequest {
  startTime: Date
  userId: string
  serviceId: string
  professionalId: string
  establishmentId: string
}

interface BookingServicesUseCaseResponse {
  booking: Booking
}

export class BookingServiceUseCase {
  constructor(
    private establishmentsRepository: EstablishmentsRepository,
    private professionalsRepository: ProfessionalsRepository,
    private servicesRepository: ServicesRepository,
    private schedulesRepository: SchedulesRepository,
    private bookingsRepository: BookingsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    startTime,
    userId,
    serviceId,
    professionalId,
    establishmentId,
  }: BookingServiceUseCaseRequest): Promise<BookingServicesUseCaseResponse> {
    let endTime = null

    const professional =
      await this.professionalsRepository.findById(professionalId)
    if (!professional) {
      throw new ProfessionalNotFoundError()
    }

    const service = await this.servicesRepository.findById(serviceId)
    if (!service) {
      throw new ServiceNotFoundError()
    }
    endTime = getEndTimeByStartTime(startTime, service.durationMinutes)

    const user = await this.usersRepository.findById(userId)
    if (!user) {
      throw new UserNotFoundError()
    }

    const establishment =
      await this.establishmentsRepository.findById(establishmentId)
    if (!establishment) {
      throw new EstablishmentNotFoundError()
    }

    if (
      establishmentId !== service.establishmentId &&
      establishmentId !== professional.establishmentId
    ) {
      throw new ResourceNotFoundError()
    }

    const conflicts = await this.bookingsRepository.isBookingConflict(
      professionalId,
      startTime,
      endTime,
    )
    if (conflicts) {
      throw new InvalidTimetableError()
    }

    const schedule = await this.schedulesRepository.findByEstablishmentId(
      service.establishmentId,
    )
    if (!schedule) {
      throw new ServiceNotFoundError()
    }

    const dayOfWeek = getDayOfWeekName(startTime)
    const isWithinOperatingHours = checkOperatingHours(
      schedule,
      dayOfWeek,
      startTime,
      endTime,
    )
    if (!isWithinOperatingHours) {
      throw new HourNotAvailable()
    }

    const booking = await this.bookingsRepository.create({
      startTime,
      endTime,
      status: 'Waiting for confirmation',
      userId,
      serviceId,
      professionalId,
      establishmentId,
    })

    return {
      booking,
    }
  }
}
