// Status code 409 (Conflict) - Conflict: Indicates that the request could not be completed due to a conflict with the current state of the target resource.
const CONFLICT_ERROR_CODE = 409

export class TimetableNotAvailableException extends Error {
  public readonly code: number

  constructor(startHour?: string, endHour?: string, reason?: string) {
    let errorMessage = 'The timetable is not available at the moment.'
    if (startHour && endHour) {
      errorMessage = `The timetable from ${startHour} to ${endHour} is not available at the moment.`
    }
    if (reason) {
      errorMessage += ` ${reason}`
    }
    super(errorMessage)
    this.name = 'TimetableNotAvailableException'
    this.code = CONFLICT_ERROR_CODE
  }
}
