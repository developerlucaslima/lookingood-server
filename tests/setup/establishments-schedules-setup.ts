import { InMemoryEstablishmentsScheduleRepository } from '@/repositories/in-memory/in-memory-establishments-schedule-repository'

export const establishmentsSchedulesSetup = async (
  schedulesRepository: InMemoryEstablishmentsScheduleRepository,
) => {
  const barberId = 'Establishment-01'

  const mondayScheduleId = 'Schedule-Monday'
  schedulesRepository.items.set(mondayScheduleId, {
    id: mondayScheduleId,
    startTime: '07:00',
    minutesWorking: 720,
    breakTime: '12:00',
    minutesBreak: 90,
    weekDay: 'MONDAY',
    establishmentId: barberId,
  })

  const tuesdayScheduleId = 'Schedule-Tuesday'
  schedulesRepository.items.set(tuesdayScheduleId, {
    id: tuesdayScheduleId,
    startTime: '07:00',
    minutesWorking: 720,
    breakTime: '12:00',
    minutesBreak: 90,
    weekDay: 'TUESDAY',
    establishmentId: barberId,
  })

  const wednesdayScheduleId = 'Schedule-Wednesday'
  schedulesRepository.items.set(wednesdayScheduleId, {
    id: wednesdayScheduleId,
    startTime: '07:00',
    minutesWorking: 720,
    breakTime: '12:00',
    minutesBreak: 90,
    weekDay: 'WEDNESDAY',
    establishmentId: barberId,
  })

  const thursdayScheduleId = 'Schedule-Thursday'
  schedulesRepository.items.set(thursdayScheduleId, {
    id: thursdayScheduleId,
    startTime: '07:00',
    minutesWorking: 720,
    breakTime: '12:00',
    minutesBreak: 90,
    weekDay: 'THURSDAY',
    establishmentId: barberId,
  })

  const fridayScheduleId = 'Schedule-Friday'
  schedulesRepository.items.set(fridayScheduleId, {
    id: fridayScheduleId,
    startTime: '07:00',
    minutesWorking: 720,
    breakTime: '12:00',
    minutesBreak: 90,
    weekDay: 'FRIDAY',
    establishmentId: barberId,
  })

  const saturdayScheduleId = 'Schedule-Saturday'
  schedulesRepository.items.set(saturdayScheduleId, {
    id: saturdayScheduleId,
    startTime: '07:00',
    minutesWorking: 540,
    breakTime: '12:00',
    minutesBreak: 90,
    weekDay: 'SATURDAY',
    establishmentId: barberId,
  })

  const sundayScheduleId = 'Schedule-Sunday'
  schedulesRepository.items.set(sundayScheduleId, {
    id: sundayScheduleId,
    startTime: '07:00',
    minutesWorking: 540,
    breakTime: '12:00',
    minutesBreak: 90,
    weekDay: 'SUNDAY',
    establishmentId: barberId,
  })
}
