// Status code 422 (Unprocessable Entity) - Unprocessable Entity: The server understands the content type of the request entity, and the syntax of the request entity is correct, but it was unable to process the contained instructions.
const UNPROCESSABLE_ENTITY_ERROR_CODE = 422

export class InvalidEmployeeScheduleException extends Error {
  public readonly code: number

  constructor(weekDay: string, reason?: string) {
    let errorMessage = `Oops! The employee's work schedule does not conform to the establishment's schedule on ${weekDay.toLocaleLowerCase}.`
    if (reason) {
      errorMessage += ` ${reason}`
    }
    super(errorMessage)
    this.name = 'InvalidEmployeeScheduleException'
    this.code = UNPROCESSABLE_ENTITY_ERROR_CODE
  }
}
