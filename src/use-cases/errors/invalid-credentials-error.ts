// Status code 401 (Unauthorized) - Unauthorized: The request has not been applied because it lacks valid authentication credentials for the target resource.
const INVALID_CREDENTIALS_ERROR_CODE = 401

export class InvalidCredentialsError extends Error {
  public readonly code: number

  constructor(reason?: string) {
    let errorMessage = 'Invalid credentials.'
    if (reason) {
      errorMessage += ` ${reason}`
    }
    super(errorMessage)
    this.name = 'InvalidCredentialsError'
    this.code = INVALID_CREDENTIALS_ERROR_CODE
  }
}
