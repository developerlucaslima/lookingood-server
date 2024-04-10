export function validateTimeFormat(timeString: string | null): boolean | null {
  if (timeString === null) {
    return null
  }

  // Checks if the time format is valid and if the hours and minutes are within the correct intervals
  const isValidTimeFormat = /^([01]\d|2[0-3]):([0-5]\d)$/.test(timeString)

  return isValidTimeFormat
}
