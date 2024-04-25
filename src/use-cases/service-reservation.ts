import { UsersRepository } from '@/repositories/users-repository'
import { Reservation } from '@prisma/client'
import { ReservationsRepository } from '@/repositories/reservations-repository'
import { EstablishmentsRepository } from '@/repositories/establishments-repository'
import { ProfessionalsRepository } from '@/repositories/professionals-repository'
import { ServicesRepository } from '@/repositories/services-repository'
import { getEndTimeByStartTime } from '@/utils/get-end-time-by-start-time'
import { ProfessionalSchedulesRepository } from '@/repositories/professional-schedules-repository'
import { EstablishmentNotFoundException } from './errors/404-establishment-not-found-exception'
import { ProfessionalNotFoundException } from './errors/404-professional-not-found-exception'
import { ResourceNotFoundException } from './errors/404-resource-not-found-exception'
import { ServiceNotFoundException } from './errors/404-service-not-found-exception'
import { UserNotFoundException } from './errors/404-user-not-found-exception'
import { TimetableNotAvailableException } from './errors/409-timetable-not-available-exception'
import { isWithinProfessionalsSchedule } from '@/utils/is-within-with-professionals-schedule'
import { getDayNameOfWeek } from '@/utils/get-day-name-of-week'

interface ServiceReservationUseCaseRequest {
  startTime: Date
  userId: string
  serviceId: string
  professionalId: string
  establishmentId: string
}

interface ServiceReservationsUseCaseResponse {
  reservation: Reservation
}

export class ServiceReservationUseCase {
  constructor(
    private establishmentsRepository: EstablishmentsRepository,
    private professionalsRepository: ProfessionalsRepository,
    private professionalSchedulesRepository: ProfessionalSchedulesRepository,
    private servicesRepository: ServicesRepository,
    private reservationsRepository: ReservationsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    startTime,
    userId,
    serviceId,
    professionalId,
    establishmentId,
  }: ServiceReservationUseCaseRequest): Promise<ServiceReservationsUseCaseResponse> {
    // It should retrieve the end time based on the start time and service duration
    const dayOfWeek = getDayNameOfWeek(startTime)

    // It should check if a professional with the given ID exists
    const professional =
      await this.professionalsRepository.findById(professionalId)
    if (!professional) {
      throw new ProfessionalNotFoundException()
    }

    // It should check if a service with the given ID exists
    const service = await this.servicesRepository.findById(serviceId)
    if (!service) {
      throw new ServiceNotFoundException()
    }
    const endTime = getEndTimeByStartTime(startTime, service.durationMinutes)

    // It should check if a user with the given ID exists
    const user = await this.usersRepository.findById(userId)
    if (!user) {
      throw new UserNotFoundException()
    }

    // It should check if an establishment with the given ID exists
    const establishment =
      await this.establishmentsRepository.findById(establishmentId)
    if (!establishment) {
      throw new EstablishmentNotFoundException()
    }

    // It should check if the establishment or professional matches the service
    if (
      establishmentId !== service.establishmentId &&
      establishmentId !== professional.establishmentId
    ) {
      throw new ResourceNotFoundException()
    }

    // It should check for conflicts in the professional's schedule
    const conflicts = await this.reservationsRepository.isReservationConflict(
      professionalId,
      startTime,
      endTime,
    )
    if (conflicts) {
      throw new TimetableNotAvailableException(
        startTime.toString(),
        endTime.toString(),
        "It's already been reserved.",
      )
    }

    // It should check if the professional has operating hours for the given time
    const professionalSchedule =
      await this.professionalSchedulesRepository.findByProfessionalIdAndWeekDay(
        professionalId,
        dayOfWeek,
      )
    if (!professionalSchedule) {
      throw new TimetableNotAvailableException(
        undefined,
        undefined,
        `Selected professional does not work on ${dayOfWeek.toLowerCase()}.`,
      )
    } else if (
      !isWithinProfessionalsSchedule(professionalSchedule, startTime, endTime)
    ) {
      throw new TimetableNotAvailableException(
        undefined,
        undefined,
        `Timetable from ${startTime.toLocaleString()} to ${endTime.toLocaleString()} is outside of professional's working hours`,
      )
    }

    // It should create a reservation
    const reservation = await this.reservationsRepository.create({
      startTime,
      endTime,
      status: 'WAITING_FOR_CONFIRMATION',
      userId,
      serviceId,
      professionalId,
      establishmentId,
    })

    // It should return the created reservation
    return {
      reservation,
    }
  }
}
