export class InvalidTimetableError extends Error {
  constructor() {
    super('This timetable is not available')
  }
}
