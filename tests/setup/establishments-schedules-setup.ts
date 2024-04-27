import { InMemoryEstablishmentsSchedulesRepository } from '@/repositories/in-memory/in-memory-establishments-schedules-repository'
import { WeekDay } from '@prisma/client'

export const establishmentsSchedulesSetup = async (
  schedulesRepository: InMemoryEstablishmentsSchedulesRepository,
) => {
  const barberId = 'Establishment-01'
  const spaId = 'Establishment-02'

  const startTimeBarber = '07:00'
  const minutesWorkingBarber = 720
  const breakTimeBarber = '12:00'
  const minutesBreakBarber = 90

  const startTimeSpa = '08:00'
  const minutesWorkingSpa = 600
  const breakTimeSpa = '13:00'
  const minutesBreakSpa = 60

  const barberSchedules = [
    { weekDay: 'MONDAY' as WeekDay, id: 'Schedule-Monday-Barber' },
    { weekDay: 'TUESDAY' as WeekDay, id: 'Schedule-Tuesday-Barber' },
    { weekDay: 'WEDNESDAY' as WeekDay, id: 'Schedule-Wednesday-Barber' },
    { weekDay: 'THURSDAY' as WeekDay, id: 'Schedule-Thursday-Barber' },
    { weekDay: 'FRIDAY' as WeekDay, id: 'Schedule-Friday-Barber' },
    { weekDay: 'SATURDAY' as WeekDay, id: 'Schedule-Saturday-Barber' },
    // { weekDay: 'SUNDAY' as WeekDay, id: 'Schedule-Sunday-Barber' },
  ]

  const spaSchedules = [
    { weekDay: 'MONDAY' as WeekDay, id: 'Schedule-Monday-Spa' },
    { weekDay: 'TUESDAY' as WeekDay, id: 'Schedule-Tuesday-Spa' },
    { weekDay: 'WEDNESDAY' as WeekDay, id: 'Schedule-Wednesday-Spa' },
    { weekDay: 'THURSDAY' as WeekDay, id: 'Schedule-Thursday-Spa' },
    { weekDay: 'FRIDAY' as WeekDay, id: 'Schedule-Friday-Spa' },
    { weekDay: 'SATURDAY' as WeekDay, id: 'Schedule-Saturday-Spa' },
    { weekDay: 'SUNDAY' as WeekDay, id: 'Schedule-Sunday-Spa' },
  ]

  barberSchedules.forEach(({ weekDay, id }) => {
    schedulesRepository.items.set(id, {
      id,
      startTime: startTimeBarber,
      minutesWorking: minutesWorkingBarber,
      breakTime: breakTimeBarber,
      minutesBreak: minutesBreakBarber,
      weekDay,
      establishmentId: barberId,
    })
  })

  spaSchedules.forEach(({ weekDay, id }) => {
    schedulesRepository.items.set(id, {
      id,
      startTime: startTimeSpa,
      minutesWorking: minutesWorkingSpa,
      breakTime: breakTimeSpa,
      minutesBreak: minutesBreakSpa,
      weekDay,
      establishmentId: spaId,
    })
  })
}
