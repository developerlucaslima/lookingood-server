const CONFLICT_ERROR_CODE = 409

export class TimetableNotAvailableException extends Error {
	public readonly code: number

	constructor() {
		super('Oops! Timetable not available.')
		this.name = 'TimetableNotAvailableException'
		this.code = CONFLICT_ERROR_CODE
	}
}
