// Status code 400 (Bad Request) - Bad Request: The server cannot or will not process the request due to an apparent client error.
const INVALID_INPUT_PARAMETERS_ERROR_CODE = 400

export class InvalidInputParametersError extends Error {
  public readonly code: number

  constructor(reason?: string) {
    let errorMessage = 'Invalid input parameters.'
    if (reason) {
      errorMessage += ` ${reason}`
    }
    super(errorMessage)
    this.name = 'InvalidInputParametersError'
    this.code = INVALID_INPUT_PARAMETERS_ERROR_CODE
  }
}
