export class InvalidTimeFormatError extends Error {
  constructor() {
    super(`This time format is not valid.`)
  }
}
