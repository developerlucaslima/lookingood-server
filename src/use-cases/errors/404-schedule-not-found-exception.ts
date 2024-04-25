// Status code 404 (Not Found) - Not Found: The requested resource could not be found but may be available in the future. Subsequent requests by the client are permissible.
const NOT_FOUND_ERROR_CODE = 404

export class ScheduleNotFoundException extends Error {
  public readonly code: number

  constructor(
    weekDay: string,
    startHour?: string,
    endHour?: string,
    reason?: string,
  ) {
    let errorMessage = `Oops! There are no schedules registered for ${weekDay.toLocaleLowerCase()} at the establishment.`
    if (startHour && endHour) {
      errorMessage = `Oops! The establishment does not work from ${startHour} to ${endHour} on ${weekDay}`
    }
    if (reason) {
      errorMessage += ` ${reason}`
    }
    super(errorMessage)
    this.name = 'ScheduleNotFoundException'
    this.code = NOT_FOUND_ERROR_CODE
  }
}
