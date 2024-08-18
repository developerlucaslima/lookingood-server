const CONFLICT_ERROR_CODE = 409

export class EmailNotAvailableException extends Error {
  public readonly code: number

  constructor() {
    super('Oops! Email not available.')
    this.name = 'EmailNotAvailableException'
    this.code = CONFLICT_ERROR_CODE
  }
}
