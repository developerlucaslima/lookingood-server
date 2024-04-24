// Status code 409 (Conflict) - Conflict: Indicates that the request could not be completed due to a conflict with the current state of the target resource.
const EMAIL_NOT_AVAILABLE_ERROR_CODE = 409

export class EmailNotAvailableError extends Error {
  public readonly code: number

  constructor(email: string, reason?: string) {
    let errorMessage = `Email '${email}' not available.`
    if (reason) {
      errorMessage += ` ${reason}`
    }
    super(errorMessage)
    this.name = 'EmailNotAvailableError'
    this.code = EMAIL_NOT_AVAILABLE_ERROR_CODE
  }
}
