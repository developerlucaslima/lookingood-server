// Status code 422 (Unprocessable Entity) - Unprocessable Entity: The server understands the content type of the request entity, and the syntax of the request entity is correct, but it was unable to process the contained instructions.
const UNPROCESSABLE_ENTITY_ERROR_CODE = 422

export class IncompleteScheduleException extends Error {
  public readonly code: number

  constructor(reason?: string) {
    let errorMessage =
      'Oops! Opening or closing time is missing for the same day.'
    if (reason) {
      errorMessage += ` ${reason}`
    }
    super(errorMessage)
    this.name = 'IncompleteScheduleException'
    this.code = UNPROCESSABLE_ENTITY_ERROR_CODE
  }
}
