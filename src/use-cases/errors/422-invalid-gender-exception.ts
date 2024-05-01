// Status code 422 (Unprocessable Entity) - Unprocessable Entity: The server understands the content type of the request entity, and the syntax of the request entity is correct, but it was unable to process the contained instructions.
const UNPROCESSABLE_ENTITY_ERROR_CODE = 422

export class InvalidGenderException extends Error {
  public readonly code: number

  constructor() {
    super("The only accepted genders are 'MALE', 'FEMALE', 'BOTH'.")

    this.name = 'InvalidGenderException'
    this.code = UNPROCESSABLE_ENTITY_ERROR_CODE
  }
}
