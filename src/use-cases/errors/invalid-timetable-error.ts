// Status code 422 (Unprocessable Entity) - Unprocessable Entity: The server understands the content type of the request entity, and the syntax of the request entity is correct, but it was unable to process the contained instructions.
const INVALID_TIMETABLE_ERROR_CODE = 422

export class InvalidTimetableError extends Error {
  public readonly code: number

  constructor(reason?: string) {
    let errorMessage = 'This timetable is not available.'
    if (reason) {
      errorMessage += ` ${reason}`
    }
    super(errorMessage)
    this.name = 'InvalidTimetableError'
    this.code = INVALID_TIMETABLE_ERROR_CODE
  }
}
