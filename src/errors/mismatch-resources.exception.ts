const CONFLICT_ERROR_CODE = 409

export class MismatchResourcesException extends Error {
  public readonly code: number

  constructor() {
    super('Oops! Mismatched resources.')
    this.name = 'MismatchResourcesException'
    this.code = CONFLICT_ERROR_CODE
  }
}
