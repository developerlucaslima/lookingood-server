export function addMinutesToTime(
  startTime: string,
  minutesToAdd: number,
): string {
  const [hoursStr, minutesStr] = startTime.split(':') // Splitting the startTime string into hours and minutes components
  const hours = parseInt(hoursStr, 10) // Parsing the hours string into an integer
  const minutes = parseInt(minutesStr, 10) // Parsing the minutes string into an integer

  // Calculate the total minutes and hours
  const totalMinutes = minutes + minutesToAdd // Adding the minutes to be added to the existing minutes
  let newHours = hours + Math.floor(totalMinutes / 60) // Calculating new hours after adding the total minutes
  const remainingMinutes = totalMinutes % 60 // Calculating remaining minutes after adjusting hours

  // Adjust the hours if necessary
  if (newHours >= 24) {
    newHours -= 24 // If newHours is greater than or equal to 24, subtract 24 to adjust
  }

  // Format the new time
  const newHoursStr = newHours < 10 ? `0${newHours}` : `${newHours}` // Formatting new hours with leading zero if necessary
  const newMinutesStr =
    remainingMinutes < 10 ? `0${remainingMinutes}` : `${remainingMinutes}` // Formatting remaining minutes with leading zero if necessary

  return `${newHoursStr}:${newMinutesStr}` // Returning the formatted new time
}
