const NOT_FOUND_ERROR_CODE = 404

export class ServiceNotFoundException extends Error {
  public readonly code: number

  constructor() {
    super('Oops! Service not found.')
    this.name = 'ServiceNotFoundException'
    this.code = NOT_FOUND_ERROR_CODE
  }
}
