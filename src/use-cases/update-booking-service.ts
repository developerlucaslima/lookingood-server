import { Booking } from '@prisma/client'

import { MismatchResourcesException } from '@/errors/mismatch-resources.exception'
import { ModificationDeadlineExceededException } from '@/errors/modification-deadline-exceeded.exception'
import { ProfessionalNotAvailableException } from '@/errors/professional-not-available.exception'
import { UserNotFoundException } from '@/errors/user-not-found.exception'
import { BookingsRepository } from '@/repositories/bookings-repository'
import { EstablishmentsRepository } from '@/repositories/establishments-repository'
import { ProfessionalsRepository } from '@/repositories/professionals-repository'
import { ProfessionalsSchedulesRepository } from '@/repositories/professionals-schedules-repository'
import { ServicesRepository } from '@/repositories/services-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { getDayNameOfWeek } from '@/utils/get-day-name-of-week'
import { getEndTimeByStartTime } from '@/utils/get-end-time-by-start-time'
import { isAvailableToUpdate } from '@/utils/is-available-to-change'
import { isBookingWithinProfessionalSchedule } from '@/utils/is-booking-within-professional-schedule'

import { BookingNotFoundException } from '../errors/booking-not-found.exception'
import { ProfessionalNotFoundException } from '../errors/professional-not-found.exception'
import { ServiceNotFoundException } from '../errors/service-not-found.exception'
import { TimetableNotAvailableException } from '../errors/timetable-not-available.exception'

interface UpdateBookingServiceUseCaseRequest {
  startTime: Date
  userId: string
  serviceId: string
  professionalId: string
  bookingId: string
}

interface UpdateBookingServicesUseCaseResponse {
  booking: Booking
}

export class UpdateBookingServiceUseCase {
  constructor(
    private establishmentsRepository: EstablishmentsRepository,
    private professionalsRepository: ProfessionalsRepository,
    private professionalSchedulesRepository: ProfessionalsSchedulesRepository,
    private servicesRepository: ServicesRepository,
    private bookingsRepository: BookingsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    startTime,
    userId,
    serviceId,
    professionalId,
    bookingId,
  }: UpdateBookingServiceUseCaseRequest): Promise<UpdateBookingServicesUseCaseResponse> {
    // It should prevent service booking update if the booking does not exist.
    const booking = await this.bookingsRepository.findById(bookingId)
    if (!booking) {
      throw new BookingNotFoundException()
    }

    // It should prevent service booking update if the user does not exist.
    const user = await this.usersRepository.findById(userId)
    if (!user) {
      throw new UserNotFoundException()
    }

    // It should prevent service booking update if the user does not match the booking.
    if (userId !== booking.userId) {
      throw new MismatchResourcesException()
    }

    // It should prevent service booking update if the service does not exist.
    const service = await this.servicesRepository.findById(serviceId)
    if (!service) {
      throw new ServiceNotFoundException()
    }

    // It should prevent service booking update if it's not within the modification deadline.
    const modificationDeadlineMinutes = service.modificationDeadlineMinutes
    if (!isAvailableToUpdate(booking.startTime, modificationDeadlineMinutes)) {
      throw new ModificationDeadlineExceededException()
    }

    // It should prevent service booking update if the professional does not exist.
    const professional =
      await this.professionalsRepository.findById(professionalId)
    if (!professional) {
      throw new ProfessionalNotFoundException()
    }

    // It should prevent service booking update if the establishment, professional and service does not match.
    const establishment = await this.establishmentsRepository.findById(
      service.establishmentId,
    )
    if (
      (establishment && establishment.id !== service.establishmentId) ||
      (establishment && establishment.id !== professional.establishmentId) ||
      service.establishmentId !== professional.establishmentId
    ) {
      throw new MismatchResourcesException()
    }

    // It should prevent service booking update if there are conflicts in the professional's schedule.
    const endTime = getEndTimeByStartTime(startTime, service.durationMinutes)
    const conflicts = await this.bookingsRepository.isBookingConflict(
      professionalId,
      startTime,
      endTime,
    )
    if (conflicts) {
      throw new TimetableNotAvailableException()
    }

    // It should prevent service booking update if the professional hasn't operating hours for the given time.
    const dayOfWeek = getDayNameOfWeek(startTime)
    const professionalSchedule =
      await this.professionalSchedulesRepository.findByProfessionalIdAndWeekDay(
        professionalId,
        dayOfWeek,
      )
    if (!professionalSchedule) {
      throw new ProfessionalNotAvailableException()
    } else if (
      !isBookingWithinProfessionalSchedule(
        professionalSchedule,
        startTime,
        endTime,
      )
    ) {
      throw new ProfessionalNotAvailableException()
    }

    // It should allow service booking update.
    booking.startTime = startTime
    booking.endTime = endTime
    booking.professionalId = professionalId
    booking.serviceId = serviceId
    booking.status = 'WAITING_FOR_CONFIRMATION'
    await this.bookingsRepository.update(booking)
    return {
      booking,
    }
  }
}
