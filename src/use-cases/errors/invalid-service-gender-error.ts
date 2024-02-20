export class InvalidServiceGenderError extends Error {
  constructor() {
    super('This service gender is not valid.')
  }
}
