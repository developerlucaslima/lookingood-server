export class InvalidServiceDurationError extends Error {
  constructor() {
    super('This service duration is not valid.')
  }
}
