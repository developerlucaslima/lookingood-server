// Status code 422 (Unprocessable Entity) - Unprocessable Entity: The server understands the content type of the request entity, and the syntax of the request entity is correct, but it was unable to process the contained instructions.
const IS_NOT_AVAILABLE_TO_CHANGE_ERROR_CODE = 422

export class IsNotAvailableToChange extends Error {
  public readonly code: number

  constructor(reason?: string) {
    let errorMessage =
      'This booking cannot be changed as the allowed time has already passed.'
    if (reason) {
      errorMessage += ` ${reason}`
    }
    super(errorMessage)
    this.name = 'IsNotAvailableToChange'
    this.code = IS_NOT_AVAILABLE_TO_CHANGE_ERROR_CODE
  }
}
