// Status code 401 (Unauthorized) - Unauthorized: Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided.
const UNAUTHORIZED_ERROR_CODE = 401

type UnauthorizedUserReason = 'unauthenticated' | 'unauthorized'

export class UnauthorizedUserException extends Error {
  public readonly code: number

  constructor(reason?: UnauthorizedUserReason) {
    switch (reason) {
      case 'unauthenticated':
        super('Sorry, only authenticated user can access here.')
        break
      case 'unauthorized':
        super('You are not authorized to access here.')
        break
      default:
        super('You are not authorized.')
    }

    this.code = UNAUTHORIZED_ERROR_CODE
    this.name = 'UnauthorizedUserExceptions'
  }
}
