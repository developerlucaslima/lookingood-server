export function validateServiceDuration(durationMinutes: number): boolean {
  if (!Number.isInteger(durationMinutes) || durationMinutes <= 0) {
    return false
  }

  if (durationMinutes % 15 !== 0) {
    return false
  }

  return true
}
