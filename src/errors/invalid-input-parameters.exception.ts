const BAD_REQUEST_ERROR_CODE = 400

export class InvalidInputParametersException extends Error {
  public readonly code: number

  constructor() {
    super('Oops! Invalid input parameters.')
    this.name = 'UnknownInputParametersException'
    this.code = BAD_REQUEST_ERROR_CODE
  }
}
