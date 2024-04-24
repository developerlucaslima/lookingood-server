// Status code 422 (Unprocessable Entity) - Unprocessable Entity: The server understands the content type of the request entity, and the syntax of the request entity is correct, but it was unable to process the contained instructions.
const UNAVAILABLE_OPENING_HOURS_ERROR_CODE = 422

export class UnavailableOpeningHoursError extends Error {
  public readonly code: number

  constructor(weekDay: string, reason?: string) {
    let errorMessage = `There are no opening hours registered for ${weekDay} at the establishment.`
    if (reason) {
      errorMessage += ` ${reason}`
    }
    super(errorMessage)
    this.name = 'UnavailableOpeningHoursError'
    this.code = UNAVAILABLE_OPENING_HOURS_ERROR_CODE
  }
}
