const INVALID_CREDENTIALS_ERROR_CODE = 401

export class InvalidCredentialsException extends Error {
  public readonly code: number

  constructor() {
    super('Oops! Invalid credentials.')
    this.name = 'InvalidCredentialsException'
    this.code = INVALID_CREDENTIALS_ERROR_CODE
  }
}
