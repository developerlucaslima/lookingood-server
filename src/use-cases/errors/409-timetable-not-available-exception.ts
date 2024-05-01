// Status code 409 (Conflict) - Conflict: Indicates that the request could not be completed due to a conflict with the current state of the target resource.
const CONFLICT_ERROR_CODE = 409

type TimetableNotAvailableReason =
  | 'conflict'
  | 'professional_no_working'
  | 'professional_day_off'

export class TimetableNotAvailableException extends Error {
  public readonly code: number

  constructor(reason: TimetableNotAvailableReason) {
    switch (reason) {
      case 'conflict':
        super('The selected timetable is occupied.')
        break
      case 'professional_no_working':
        super('This professional will not be available at the selected time.')
        break
      case 'professional_day_off':
        super('This professional will not be available on the selected day.')
        break
      default:
        super('This timetable is not available.')
    }

    this.name = 'TimetableNotAvailableException'
    this.code = CONFLICT_ERROR_CODE
  }
}
