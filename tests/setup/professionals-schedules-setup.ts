import { InMemoryProfessionalsSchedulesRepository } from '@/repositories/in-memory/in-memory-professionals-schedules-repository'
import { WeekDay } from '@prisma/client'

export const professionalsSchedulesSetup = async (
  schedulesRepository: InMemoryProfessionalsSchedulesRepository,
) => {
  const johnId = 'Professional-01'
  const janeId = 'Professional-02'

  const startTime = '08:00'
  const minutesWorking = 480
  const breakTime = '12:00'
  const minutesBreak = 60

  const johnSchedules = [
    { weekDay: 'MONDAY' as WeekDay, id: 'Schedule-Monday-John' },
    { weekDay: 'TUESDAY' as WeekDay, id: 'Schedule-Tuesday-John' },
    { weekDay: 'WEDNESDAY' as WeekDay, id: 'Schedule-Wednesday-John' },
    { weekDay: 'THURSDAY' as WeekDay, id: 'Schedule-Thursday-John' },
    { weekDay: 'FRIDAY' as WeekDay, id: 'Schedule-Friday-John' },
    { weekDay: 'SATURDAY' as WeekDay, id: 'Schedule-Saturday-John' },
    // { weekDay: 'SUNDAY' as WeekDay, id: 'Schedule-Sunday-John' },
  ]

  const janeSchedules = [
    { weekDay: 'MONDAY' as WeekDay, id: 'Schedule-Monday-Jane' },
    { weekDay: 'TUESDAY' as WeekDay, id: 'Schedule-Tuesday-Jane' },
    { weekDay: 'WEDNESDAY' as WeekDay, id: 'Schedule-Wednesday-Jane' },
    { weekDay: 'THURSDAY' as WeekDay, id: 'Schedule-Thursday-Jane' },
    { weekDay: 'FRIDAY' as WeekDay, id: 'Schedule-Friday-Jane' },
    { weekDay: 'SATURDAY' as WeekDay, id: 'Schedule-Saturday-Jane' },
    // { weekDay: 'SUNDAY' as WeekDay, id: 'Schedule-Sunday-Jane' },
  ]

  johnSchedules.forEach(({ weekDay, id }) => {
    schedulesRepository.items.set(id, {
      id,
      startTime,
      minutesWorking,
      breakTime,
      minutesBreak,
      weekDay,
      professionalId: johnId,
    })
  })

  janeSchedules.forEach(({ weekDay, id }) => {
    schedulesRepository.items.set(id, {
      id,
      startTime,
      minutesWorking,
      breakTime,
      minutesBreak,
      weekDay,
      professionalId: janeId,
    })
  })
}
