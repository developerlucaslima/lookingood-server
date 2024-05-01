// Status code 401 (Unauthorized) - Unauthorized: Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided.
const UNAUTHORIZED_ERROR_CODE = 401

export class UnauthorizedCredentialsException extends Error {
  public readonly code: number

  constructor() {
    super("Account doesn't exist")

    this.name = 'UnauthorizedCredentialsException'
    this.code = UNAUTHORIZED_ERROR_CODE
  }
}
