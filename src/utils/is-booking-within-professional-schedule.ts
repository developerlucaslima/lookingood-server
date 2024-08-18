import { ProfessionalSchedule } from '@prisma/client'

import { getMinutesByTime } from './get-minutes-by-time'

export function isBookingWithinProfessionalSchedule(
  professionalSchedule: Readonly<ProfessionalSchedule>,
  startTime: Date,
  endTime: Date,
): boolean {
  const professionalStartMinutes = getMinutesByTime(
    professionalSchedule.startTime,
  )
  const professionalEndMinutes =
    professionalStartMinutes + professionalSchedule.minutesWorking
  const bookingStartMinutes = getMinutesByTime(
    `${startTime.getHours()}:${startTime.getMinutes()}`,
  )
  const bookingEndMinutes = getMinutesByTime(
    `${endTime.getHours()}:${endTime.getMinutes()}`,
  )

  // Check if the booking falls outside of the professional's working hours
  if (
    bookingStartMinutes < professionalStartMinutes ||
    bookingEndMinutes > professionalEndMinutes
  ) {
    return false
  }

  // Check if the booking falls within the professional's break time, if applicable
  if (professionalSchedule.breakTime && professionalSchedule.minutesBreak) {
    const professionalBreakStartMinutes = getMinutesByTime(
      professionalSchedule.breakTime,
    )
    const professionalBreakEndMinutes =
      professionalBreakStartMinutes + professionalSchedule.minutesBreak

    if (
      bookingStartMinutes >= professionalBreakStartMinutes &&
      bookingEndMinutes <= professionalBreakEndMinutes
    ) {
      return false
    }
  }

  // If the booking passes all checks, it is within the professional's schedule
  return true
}
