// Status code 422 (Unprocessable Entity) - Unprocessable Entity: The server understands the content type of the request entity, and the syntax of the request entity is correct, but it was unable to process the contained instructions.
const UNPROCESSABLE_ENTITY_ERROR_CODE = 422

export class ModificationDeadlineExceededError extends Error {
  public readonly code: number

  constructor() {
    super('The deadline for modifying this reservation has already expired.')

    this.name = 'ModificationDeadlineExceededError'
    this.code = UNPROCESSABLE_ENTITY_ERROR_CODE
  }
}
