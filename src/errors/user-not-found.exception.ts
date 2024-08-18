const NOT_FOUND_ERROR_CODE = 404

export class UserNotFoundException extends Error {
  public readonly code: number

  constructor() {
    super('Oops! User not found.')
    this.name = 'UserNotFoundException'
    this.code = NOT_FOUND_ERROR_CODE
  }
}
