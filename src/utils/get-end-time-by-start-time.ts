export function getEndTimeByStartTime(
  startTime: Date,
  durationMinutes: number,
) {
  const endTimeInMilliseconds = startTime.getTime() + durationMinutes * 60000
  return new Date(endTimeInMilliseconds)
}
