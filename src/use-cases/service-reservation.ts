import { UsersRepository } from '@/repositories/users-repository'
import { Reservation } from '@prisma/client'
import { ReservationsRepository } from '@/repositories/reservations-repository'
import { EstablishmentsRepository } from '@/repositories/establishments-repository'
import { ProfessionalsRepository } from '@/repositories/professionals-repository'
import { ServicesRepository } from '@/repositories/services-repository'
import { getEndTimeByStartTime } from '@/utils/get-end-time-by-start-time'
import { EstablishmentNotFoundException } from './errors/404-establishment-not-found-exception'
import { ProfessionalNotFoundException } from './errors/404-professional-not-found-exception'
import { ResourceNotFoundException } from './errors/404-resource-not-found-exception'
import { ServiceNotFoundException } from './errors/404-service-not-found-exception'
import { UserNotFoundException } from './errors/404-user-not-found-exception'
import { TimetableNotAvailableException } from './errors/409-timetable-not-available-exception'
import { isWithinProfessionalsSchedule } from '@/utils/is-within-with-professionals-schedule'
import { getDayNameOfWeek } from '@/utils/get-day-name-of-week'
import { ProfessionalsSchedulesRepository } from '@/repositories/professionals-schedules-repository'

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
    private professionalSchedulesRepository: ProfessionalsSchedulesRepository,
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
    // It should prevent service reservation if professional does not exist
    const professional =
      await this.professionalsRepository.findById(professionalId)
    if (!professional) {
      throw new ProfessionalNotFoundException()
    }

    // It should prevent service reservation if service does not exist
    const service = await this.servicesRepository.findById(serviceId)
    if (!service) {
      throw new ServiceNotFoundException()
    }
    const endTime = getEndTimeByStartTime(startTime, service.durationMinutes)

    // It should prevent service reservation if user does not exist
    const user = await this.usersRepository.findById(userId)
    if (!user) {
      throw new UserNotFoundException()
    }

    // It should prevent service reservation if establishment does not exist
    const establishment =
      await this.establishmentsRepository.findById(establishmentId)
    if (!establishment) {
      throw new EstablishmentNotFoundException()
    }

    // It should prevent service reservation if the establishment or professional does not match the service
    if (
      establishmentId !== service.establishmentId &&
      establishmentId !== professional.establishmentId
    ) {
      throw new ResourceNotFoundException()
    }

    // It should prevent service reservation if there are conflicts in the professional's schedule
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

    // It should prevent service reservation if the professional does not have operating hours for the given time
    const dayOfWeek = getDayNameOfWeek(startTime)
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

    // should allow service reservation
    const reservation = await this.reservationsRepository.create({
      startTime,
      endTime,
      status: 'WAITING_FOR_CONFIRMATION',
      userId,
      serviceId,
      professionalId,
      establishmentId,
    })
    return {
      reservation,
    }
  }
}
