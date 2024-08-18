const UNPROCESSABLE_ENTITY_ERROR_CODE = 422

export class InvalidScheduleException extends Error {
  public readonly code: number

  constructor() {
    super('Oops! Invalid schedule.')
    this.name = 'InvalidScheduleException'
    this.code = UNPROCESSABLE_ENTITY_ERROR_CODE
  }
}
