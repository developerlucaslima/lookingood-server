import { ProfessionalSchedule } from '@prisma/client'
import { getMinutesByTime } from './get-minutes-by-time'

export function isWithinProfessionalsSchedule(
  professionalSchedule: ProfessionalSchedule,
  startTime: Date,
  endTime: Date,
): boolean {
  const professionalStartMinutes = getMinutesByTime(
    professionalSchedule.startTime,
  )
  const professionalEndMinutes =
    professionalStartMinutes + professionalSchedule.minutesWorking
  const reservationStartMinutes = getMinutesByTime(
    `${startTime.getHours()}:${startTime.getMinutes()}`,
  )
  const reservationEndMinutes = getMinutesByTime(
    `${endTime.getHours()}:${endTime.getMinutes()}`,
  )

  // Check if the reservation falls outside of the professional's working hours
  if (
    reservationStartMinutes < professionalStartMinutes ||
    reservationEndMinutes > professionalEndMinutes
  ) {
    return false
  }

  // Check if the reservation falls within the professional's break time, if applicable
  if (professionalSchedule.breakTime && professionalSchedule.minutesBreak) {
    const professionalBreakStartMinutes = getMinutesByTime(
      professionalSchedule.breakTime,
    )
    const professionalBreakEndMinutes =
      professionalBreakStartMinutes + professionalSchedule.minutesBreak

    if (
      reservationStartMinutes >= professionalBreakStartMinutes &&
      reservationEndMinutes <= professionalBreakEndMinutes
    ) {
      return false
    }
  }

  // If the reservation passes all checks, it is within the professional's schedule
  return true
}
