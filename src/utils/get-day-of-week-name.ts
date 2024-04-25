import { WeekDay } from '@prisma/client'

export function getDayOfWeekName(date: Date): WeekDay {
  const days: WeekDay[] = [
    'SUNDAY',
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
  ]
  return days[date.getDay()] as WeekDay
}
