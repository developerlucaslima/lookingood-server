// Status code 400 (Bad Request) - Bad Request: The server cannot or will not process the request due to an apparent client error.
const BAD_REQUEST_ERROR_CODE = 400

type InvalidInputParametersReason = 'negative'

export class InvalidInputParametersException extends Error {
  public readonly code: number

  constructor(reason?: InvalidInputParametersReason) {
    switch (reason) {
      case 'negative':
        super('Minutes cannot be negative.')
        break
      default:
        super('Oops! Please review and try again.')
    }

    this.name = 'InvalidInputParametersException'
    this.code = BAD_REQUEST_ERROR_CODE
  }
}
