export class ScheduleTimesNotFoundError extends Error {
  constructor() {
    super('Schedule times not found.')
  }
}
