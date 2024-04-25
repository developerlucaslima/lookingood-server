// Status code 400 (Bad Request) - Bad Request: The server cannot or will not process the request due to an apparent client error.
const BAD_REQUEST_ERROR_CODE = 400

export class InvalidInputParametersException extends Error {
  public readonly code: number

  constructor(reason?: string) {
    let errorMessage = 'Oops! Invalid input parameters.'
    if (reason) {
      errorMessage += ` ${reason}`
    }
    super(errorMessage)
    this.name = 'InvalidInputParametersException'
    this.code = BAD_REQUEST_ERROR_CODE
  }
}
