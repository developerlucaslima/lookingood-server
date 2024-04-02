export class HourNotAvailable extends Error {
  constructor() {
    super('This hour is not available')
  }
}
