export class EstablishmentNotFoundError extends Error {
  constructor() {
    super('Establishment not found.')
  }
}
