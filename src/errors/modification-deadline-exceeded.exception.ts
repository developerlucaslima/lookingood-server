const UNPROCESSABLE_ENTITY_ERROR_CODE = 422

export class ModificationDeadlineExceededException extends Error {
	public readonly code: number

	constructor() {
		super('Oops! Modification deadline exceeded.')
		this.name = 'ModificationDeadlineExceededException'
		this.code = UNPROCESSABLE_ENTITY_ERROR_CODE
	}
}
