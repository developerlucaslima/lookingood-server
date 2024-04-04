export function isAvailableToChange(
  startTime: Date,
  modificationDeadlineMinutes: number,
): boolean {
  const currentTime = new Date().getTime()
  const minutesLaterInMilliseconds = modificationDeadlineMinutes * 60000
  const targetTime = startTime.getTime() - minutesLaterInMilliseconds

  return currentTime < targetTime
}
