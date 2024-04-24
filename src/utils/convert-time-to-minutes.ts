export function convertTimeToMinutes(time: string): number {
  const [hourStr, minuteStr] = time.split(':')
  const hourInt = parseInt(hourStr, 10) * 60
  const minutesInt = parseInt(minuteStr, 10)

  return hourInt + minutesInt
}
