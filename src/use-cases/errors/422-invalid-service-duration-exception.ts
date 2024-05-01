// Status code 422 (Unprocessable Entity) - Unprocessable Entity: The server understands the content type of the request entity, and the syntax of the request entity is correct, but it was unable to process the contained instructions.
const UNPROCESSABLE_ENTITY_ERROR_CODE = 422

export class InvalidServiceDurationException extends Error {
  public readonly code: number

  constructor() {
    super('Service duration must be a multiple of 15 minutes.')

    this.name = 'InvalidServiceDurationException'
    this.code = UNPROCESSABLE_ENTITY_ERROR_CODE
  }
}
