// Status code 422 (Unprocessable Entity) - Unprocessable Entity: The server understands the content type of the request entity, and the syntax of the request entity is correct, but it was unable to process the contained instructions.
const INVALID_TIME_FORMAT_ERROR_CODE = 422

export class InvalidTimeFormatError extends Error {
  public readonly code: number

  constructor(reason?: string) {
    let errorMessage = 'This time format is not valid.'
    if (reason) {
      errorMessage += ` ${reason}`
    }
    super(errorMessage)
    this.name = 'InvalidTimeFormatError'
    this.code = INVALID_TIME_FORMAT_ERROR_CODE
  }
}
