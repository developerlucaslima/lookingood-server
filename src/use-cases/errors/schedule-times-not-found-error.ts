// Status code 404 (Not Found) - Not Found: The requested resource could not be found but may be available in the future. Subsequent requests by the client are permissible.
const SCHEDULE_TIMES_NOT_FOUND_ERROR_CODE = 404

export class ScheduleTimesNotFoundError extends Error {
  public readonly code: number

  constructor(reason?: string) {
    let errorMessage = 'Schedule times not found.'
    if (reason) {
      errorMessage += ` ${reason}`
    }
    super(errorMessage)
    this.name = 'ScheduleTimesNotFoundError'
    this.code = SCHEDULE_TIMES_NOT_FOUND_ERROR_CODE
  }
}
