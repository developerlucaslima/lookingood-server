// Status code 422 (Unprocessable Entity) - Unprocessable Entity: The server understands the content type of the request entity, and the syntax of the request entity is correct, but it was unable to process the contained instructions.
const UNPROCESSABLE_ENTITY_ERROR_CODE = 422

type InvalidScheduleReason =
  | 'mismatched'
  | 'invalid_break'
  | 'establishment_no_schedule'

export class InvalidScheduleException extends Error {
  public readonly code: number

  constructor(reason?: InvalidScheduleReason) {
    switch (reason) {
      case 'mismatched':
        super(
          "Professional schedule does not match the establishment's schedule.",
        )
        break
      case 'invalid_break':
        super('Start or end break time is missing.')
        break
      case 'establishment_no_schedule':
        super('No schedules registered at the establishment for this day.')
        break
      default:
        super('Invalid reason provided.')
    }

    this.name = 'InvalidScheduleException'
    this.code = UNPROCESSABLE_ENTITY_ERROR_CODE
  }
}
