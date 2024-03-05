import { SchedulesRepository } from '@/repositories/schedule-repository'
import { Schedule } from '@prisma/client'
import { EstablishmentsRepository } from '@/repositories/establishments-repository'
import { EstablishmentNotFoundError } from '../errors/establishment-not-found-error'
import { validateTimeFormat } from '../utils/validate-timetable-format'
import { InvalidTimeFormatError } from '../errors/invalid-time-format-error'
import { ScheduleTimesNotFoundError } from '../errors/schedule-times-not-found-error'
import { OpeningOrClosingNotFoundError } from '../errors/opening-or-closing-not-found-error'

interface AddScheduleUseCaseRequest {
  monOpeningTime: string | null
  tueOpeningTime: string | null
  wedOpeningTime: string | null
  thuOpeningTime: string | null
  friOpeningTime: string | null
  satOpeningTime: string | null
  sunOpeningTime: string | null
  monClosingTime: string | null
  tueClosingTime: string | null
  wedClosingTime: string | null
  thuClosingTime: string | null
  friClosingTime: string | null
  satClosingTime: string | null
  sunClosingTime: string | null
  establishmentId: string
}

interface AddScheduleUseCaseResponse {
  schedule: Schedule
}

export class AddScheduleUseCase {
  constructor(
    private establishmentRepository: EstablishmentsRepository,
    private schedulesRepository: SchedulesRepository,
  ) {}

  async execute({
    monOpeningTime,
    tueOpeningTime,
    wedOpeningTime,
    thuOpeningTime,
    friOpeningTime,
    satOpeningTime,
    sunOpeningTime,
    monClosingTime,
    tueClosingTime,
    wedClosingTime,
    thuClosingTime,
    friClosingTime,
    satClosingTime,
    sunClosingTime,
    establishmentId,
  }: AddScheduleUseCaseRequest): Promise<AddScheduleUseCaseResponse> {
    const establishment =
      await this.establishmentRepository.findById(establishmentId)

    if (!establishment) {
      throw new EstablishmentNotFoundError()
    }

    const openingTimes = [
      monOpeningTime,
      tueOpeningTime,
      wedOpeningTime,
      thuOpeningTime,
      friOpeningTime,
      satOpeningTime,
      sunOpeningTime,
    ]
    const closingTimes = [
      monClosingTime,
      tueClosingTime,
      wedClosingTime,
      thuClosingTime,
      friClosingTime,
      satClosingTime,
      sunClosingTime,
    ]
    const scheduleTimes = openingTimes.concat(closingTimes)

    const scheduleTimesNull = scheduleTimes.every((time) => time === null)
    if (scheduleTimesNull) {
      throw new ScheduleTimesNotFoundError()
    }

    for (const time of scheduleTimes) {
      if (time !== null && !validateTimeFormat(time)) {
        throw new InvalidTimeFormatError()
      }
    }

    openingTimes.forEach((openingTime, index) => {
      if (openingTime !== null && closingTimes[index] === null) {
        throw new OpeningOrClosingNotFoundError()
      }

      if (closingTimes[index] !== null && openingTime === null) {
        throw new OpeningOrClosingNotFoundError()
      }
    })

    const schedule = await this.schedulesRepository.create({
      monOpeningTime,
      tueOpeningTime,
      wedOpeningTime,
      thuOpeningTime,
      friOpeningTime,
      satOpeningTime,
      sunOpeningTime,
      monClosingTime,
      tueClosingTime,
      wedClosingTime,
      thuClosingTime,
      friClosingTime,
      satClosingTime,
      sunClosingTime,
      establishmentId,
    })

    return {
      schedule,
    }
  }
}
