import { EstablishmentsRepository } from '@/repositories/establishments-repository'
import { EstablishmentNotFoundError } from '@/use-cases/errors/establishment-not-found-error'
import { $Enums, EstablishmentSchedule } from '@prisma/client'
import { EstablishmentSchedulesRepository } from '@/repositories/establishment-schedules-repository'

interface AddEstablishmentScheduleUseCaseRequest {
  startTime: string
  minutesWorking: number
  breakTime: string | null
  minutesBreak: number | null
  weekDay: $Enums.WeekDay
  establishmentId: string
}

interface AddEstablishmentScheduleUseCaseResponse {
  schedule: EstablishmentSchedule
}

export class AddEstablishmentScheduleUseCase {
  constructor(
    private establishmentsRepository: EstablishmentsRepository,
    private schedulesRepository: EstablishmentSchedulesRepository,
  ) {}

  async execute({
    startTime,
    minutesWorking,
    breakTime,
    minutesBreak,
    weekDay,
    establishmentId,
  }: AddEstablishmentScheduleUseCaseRequest): Promise<AddEstablishmentScheduleUseCaseResponse> {
    // it shouldn't be possible to create a schedule if the establishment doesn't exist
    const establishment =
      await this.establishmentsRepository.findById(establishmentId)
    if (!establishment) {
      throw new EstablishmentNotFoundError()
    }

    // it should be possible to create an establishment schedule
    const schedule = await this.schedulesRepository.create({
      startTime,
      minutesWorking,
      breakTime,
      minutesBreak,
      weekDay,
      establishmentId,
    })

    // it should return the created establishment schedule
    return {
      schedule,
    }
  }
}
