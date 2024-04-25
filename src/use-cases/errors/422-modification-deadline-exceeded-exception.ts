// Status code 422 (Unprocessable Entity) - Unprocessable Entity: The server understands the content type of the request entity, and the syntax of the request entity is correct, but it was unable to process the contained instructions.
const UNPROCESSABLE_ENTITY_ERROR_CODE = 422

export class ModificationDeadlineExceededError extends Error {
  public readonly code: number

  constructor(
    reason?: string,
    startTime?: Date,
    modificationDeadlineMinutes?: number,
  ) {
    let errorMessage =
      'The modification deadline for this reservation has already passed.'
    if (reason) {
      errorMessage += ` ${reason}`
    }
    if (startTime && modificationDeadlineMinutes) {
      const modificationDeadline = new Date(
        startTime.getTime() - modificationDeadlineMinutes * 60000,
      )
      errorMessage = ` Your reservation started on ${startTime.toLocaleString()} and should have been modified before ${modificationDeadline.toLocaleString()}.`
    }
    super(errorMessage)
    this.name = 'ModificationDeadlineExceededError'
    this.code = UNPROCESSABLE_ENTITY_ERROR_CODE
  }
}
