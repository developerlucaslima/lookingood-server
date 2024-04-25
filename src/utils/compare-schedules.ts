import { getMinutesByTime } from './get-minutes-by-time'

export function compareSchedules(
  startTime: string,
  minutesWorking: number,
  breakTime: string | null,
  minutesBreak: number | null,
  establishmentStartMinutes: string,
  establishmentMinutesWorking: number,
  establishmentBreakTime: string | null,
  establishmentMinutesBreak: number | null,
): boolean {
  // Convert the times to minutes
  const start = getMinutesByTime(startTime)
  const end = start + minutesWorking
  const establishmentStart = getMinutesByTime(establishmentStartMinutes)
  const establishmentEnd = establishmentStart + establishmentMinutesWorking

  // Check if the professional's start time is within the establishment's working hours
  if (start < establishmentStart || start >= establishmentEnd) {
    return false
  }

  // Check if the professional's end time is within the establishment's working hours
  if (end <= establishmentStart || end > establishmentEnd) {
    return false
  }

  // If there's a break in the establishment and the professional is working during that time, return false
  if (
    establishmentBreakTime &&
    establishmentMinutesBreak &&
    breakTime &&
    minutesBreak
  ) {
    const establishmentBreakStart = getMinutesByTime(establishmentBreakTime)
    const establishmentBreakEnd =
      establishmentBreakStart + establishmentMinutesBreak

    if (
      (start < establishmentBreakEnd && end > establishmentBreakStart) ||
      (getMinutesByTime(breakTime) < establishmentEnd &&
        getMinutesByTime(breakTime) >= establishmentStart)
    ) {
      return false
    }
  }

  return true
}
