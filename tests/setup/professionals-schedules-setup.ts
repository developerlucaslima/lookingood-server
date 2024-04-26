import { InMemoryProfessionalsScheduleRepository } from '@/repositories/in-memory/in-memory-professionals-schedule-repository'

export const professionalsSchedulesSetup = async (
  schedulesRepository: InMemoryProfessionalsScheduleRepository,
) => {
  const johnId = 'Professional-01'

  const mondayScheduleId = 'Schedule-Monday'
  schedulesRepository.items.set(mondayScheduleId, {
    id: mondayScheduleId,
    startTime: '08:00',
    minutesWorking: 480,
    breakTime: '12:00',
    minutesBreak: 60,
    weekDay: 'MONDAY',
    professionalId: johnId,
  })

  const tuesdayScheduleId = 'Schedule-Tuesday'
  schedulesRepository.items.set(tuesdayScheduleId, {
    id: tuesdayScheduleId,
    startTime: '08:00',
    minutesWorking: 480,
    breakTime: '12:00',
    minutesBreak: 60,
    weekDay: 'TUESDAY',
    professionalId: johnId,
  })

  const wednesdayScheduleId = 'Schedule-Wednesday'
  schedulesRepository.items.set(wednesdayScheduleId, {
    id: wednesdayScheduleId,
    startTime: '08:00',
    minutesWorking: 480,
    breakTime: '12:00',
    minutesBreak: 60,
    weekDay: 'WEDNESDAY',
    professionalId: johnId,
  })

  const thursdayScheduleId = 'Schedule-Thursday'
  schedulesRepository.items.set(thursdayScheduleId, {
    id: thursdayScheduleId,
    startTime: '08:00',
    minutesWorking: 480,
    breakTime: '12:00',
    minutesBreak: 60,
    weekDay: 'THURSDAY',
    professionalId: johnId,
  })

  const fridayScheduleId = 'Schedule-Friday'
  schedulesRepository.items.set(fridayScheduleId, {
    id: fridayScheduleId,
    startTime: '08:00',
    minutesWorking: 480,
    breakTime: '12:00',
    minutesBreak: 60,
    weekDay: 'FRIDAY',
    professionalId: johnId,
  })

  const saturdayScheduleId = 'Schedule-Saturday'
  schedulesRepository.items.set(saturdayScheduleId, {
    id: saturdayScheduleId,
    startTime: '08:00',
    minutesWorking: 360,
    breakTime: '12:00',
    minutesBreak: 60,
    weekDay: 'SATURDAY',
    professionalId: johnId,
  })

  // const sundayScheduleId = 'Schedule-Sunday'
  // schedulesRepository.items.set(sundayScheduleId, {
  //   id: sundayScheduleId,
  //   startTime: null,
  //   minutesWorking: 0,
  //   breakTime: null,
  //   minutesBreak: null,
  //   weekDay: 'SUNDAY',
  //   professionalId: johnId,
  // })
}
