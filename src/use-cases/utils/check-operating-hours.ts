import { Schedule } from '@prisma/client'
import { timeToMinutesOfDay } from './time-to-minutes-of-day'

export function checkOperatingHours(
  schedule: Schedule,
  dayOfWeek: string,
  startTime: Date,
  endTime: Date,
): boolean {
  const openingTimeKey: keyof Schedule =
    `${dayOfWeek.toLowerCase()}OpeningTime` as keyof Schedule
  const closingTimeKey: keyof Schedule =
    `${dayOfWeek.toLowerCase()}ClosingTime` as keyof Schedule

  const openingTime = schedule[openingTimeKey]
  const closingTime = schedule[closingTimeKey]

  if (!openingTime || !closingTime) {
    console.log('erro 1')
    return false
  }

  const startHours = startTime.getHours()
  const startMinutes = startTime.getMinutes()
  const endHours = endTime.getHours()
  const endMinutes = endTime.getMinutes()

  const startMinutesOfDay = startHours * 60 + startMinutes
  const endMinutesOfDay = endHours * 60 + endMinutes
  const openingMinutesOfDay = timeToMinutesOfDay(openingTime)
  const closingMinutesOfDay = timeToMinutesOfDay(closingTime)

  return (
    startMinutesOfDay >= openingMinutesOfDay &&
    endMinutesOfDay <= closingMinutesOfDay
  )
}
