// Status code 422 (Unprocessable Entity) - Unprocessable Entity: The server understands the content type of the request entity, and the syntax of the request entity is correct, but it was unable to process the contained instructions.
const OPENING_OR_CLOSING_NOT_FOUND_ERROR_CODE = 422

export class OpeningOrClosingNotFoundError extends Error {
  public readonly code: number

  constructor(reason?: string) {
    let errorMessage =
      'It is necessary to create both an opening and a closing time for the same day.'
    if (reason) {
      errorMessage += ` ${reason}`
    }
    super(errorMessage)
    this.name = 'OpeningOrClosingNotFoundError'
    this.code = OPENING_OR_CLOSING_NOT_FOUND_ERROR_CODE
  }
}
