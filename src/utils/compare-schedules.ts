import { convertTimeToMinutes } from './convert-time-to-minutes'

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
  const start = convertTimeToMinutes(startTime)
  const end = start + minutesWorking
  const establishmentStart = convertTimeToMinutes(establishmentStartMinutes)
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
    const establishmentBreakStart = convertTimeToMinutes(establishmentBreakTime)
    const establishmentBreakEnd =
      establishmentBreakStart + establishmentMinutesBreak

    if (
      (start < establishmentBreakEnd && end > establishmentBreakStart) ||
      (convertTimeToMinutes(breakTime) < establishmentEnd &&
        convertTimeToMinutes(breakTime) >= establishmentStart)
    ) {
      return false
    }
  }

  return true
}
