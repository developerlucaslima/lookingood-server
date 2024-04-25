// Status code 401 (Unauthorized) - Unauthorized: Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided.
const UNAUTHORIZED_ERROR_CODE = 401

export class InvalidCredentialsException extends Error {
  public readonly code: number

  constructor(reason?: string) {
    let errorMessage = 'This email address or password is incorrect.'
    if (reason) {
      errorMessage += ` ${reason}`
    }
    super(errorMessage)
    this.name = 'InvalidCredentialsException'
    this.code = UNAUTHORIZED_ERROR_CODE
  }
}
