// Status code 422 (Unprocessable Entity) - Unprocessable Entity: The server understands the content type of the request entity, and the syntax of the request entity is correct, but it was unable to process the contained instructions.
const INVALID_EMPLOYEE_SCHEDULE_ERROR_CODE = 422

export class InvalidEmployeeScheduleError extends Error {
  public readonly code: number

  constructor(weekDay: string, reason?: string) {
    let errorMessage = `The employee's work schedule does not conform to the establishment's schedule on ${weekDay}.`
    if (reason) {
      errorMessage += ` ${reason}`
    }
    super(errorMessage)
    this.name = 'InvalidEmployeeScheduleError'
    this.code = INVALID_EMPLOYEE_SCHEDULE_ERROR_CODE
  }
}
