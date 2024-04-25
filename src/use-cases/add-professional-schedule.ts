import { ProfessionalSchedulesRepository } from '@/repositories/professional-schedules-repository'
import { ProfessionalsRepository } from '@/repositories/professionals-repository'
import { $Enums, ProfessionalSchedule } from '@prisma/client'
import { EstablishmentsRepository } from '@/repositories/establishments-repository'
import { EstablishmentSchedulesRepository } from '@/repositories/establishment-schedules-repository'
import { compareSchedules } from '@/utils/compare-schedules'
import { ProfessionalNotFoundException } from './errors/404-professional-not-found-exception'
import { EstablishmentNotFoundException } from './errors/404-establishment-not-found-exception'
import { InvalidInputParametersException } from './errors/400-invalid-input-parameters-exception'
import { ScheduleNotFoundException } from './errors/404-schedule-not-found-exception'
import { InvalidEmployeeScheduleException } from './errors/422-invalid-employee-schedule-exception'

interface AddProfessionalScheduleUseCaseRequest {
  startTime: string
  minutesWorking: number
  breakTime: string | null
  minutesBreak: number | null
  weekDay: $Enums.WeekDay
  professionalId: string
}

interface AddProfessionalScheduleUseCaseResponse {
  schedule: ProfessionalSchedule
}

export class AddProfessionalScheduleUseCase {
  constructor(
    private professionalsRepository: ProfessionalsRepository,
    private professionalSchedulesRepository: ProfessionalSchedulesRepository,
    private establishmentsRepository: EstablishmentsRepository,
    private establishmentSchedulesRepository: EstablishmentSchedulesRepository,
  ) {}

  async execute({
    startTime,
    minutesWorking,
    breakTime,
    minutesBreak,
    weekDay,
    professionalId,
  }: AddProfessionalScheduleUseCaseRequest): Promise<AddProfessionalScheduleUseCaseResponse> {
    // it shouldn't be possible to create a schedule if the professional doesn't exist
    const professional =
      await this.professionalsRepository.findById(professionalId)
    if (!professional) {
      throw new ProfessionalNotFoundException()
    }

    // it shouldn't be possible to create a schedule if the establishment doesn't exist
    const establishment = await this.establishmentsRepository.findById(
      professional.establishmentId,
    )
    if (!establishment) {
      throw new EstablishmentNotFoundException()
    }

    // it shouldn't be possible to create a schedule with negative time parameters
    if (minutesWorking < 0 || (breakTime && minutesBreak && minutesBreak < 0)) {
      throw new InvalidInputParametersException('Minutes cannot be negative.')
    }

    // it shouldn't be possible to create a schedule if the establishment doesn't have opening hours for the given weekday
    const establishmentSchedule =
      await this.establishmentSchedulesRepository.findByEstablishmentIdAndWeekDay(
        establishment.id,
        weekDay,
      )
    if (!establishmentSchedule) {
      throw new ScheduleNotFoundException(weekDay)
    }

    // it shouldn't be possible to create a schedule if the professional's schedule conflicts with the establishment's schedule
    if (weekDay === establishmentSchedule.weekDay) {
      const isCompatibleSchedules = compareSchedules(
        startTime,
        minutesWorking,
        breakTime,
        minutesBreak,
        establishmentSchedule.startTime,
        establishmentSchedule.minutesWorking,
        establishmentSchedule.breakTime,
        establishmentSchedule.minutesBreak,
      )
      if (!isCompatibleSchedules) {
        throw new InvalidEmployeeScheduleException(weekDay)
      }
    }

    // it should be possible to create a professional schedule
    const schedule = await this.professionalSchedulesRepository.create({
      startTime,
      minutesWorking,
      breakTime,
      minutesBreak,
      weekDay,
      professionalId,
    })

    // it should return the created professional schedule
    return { schedule }
  }
}
