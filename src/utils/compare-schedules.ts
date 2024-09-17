import { getMinutesByTime } from './get-minutes-by-time'

export function compareSchedules(
	// professional schedule
	professionalStartTime: string, // HH:mm
	professionalMinutesWorking: number, // total minutes
	professionalBreakTime: string | null, // HH:mm
	professionalMinutesBreak: number | null, // total minutes
	// establishment schedule
	establishmentStartMinutes: string, // HH:mm
	establishmentMinutesWorking: number, // total minutes
	establishmentBreakTime: string | null, // HH:mm
	establishmentMinutesBreak: number | null, // total minutes
): boolean {
	const professionalStart = getMinutesByTime(professionalStartTime)
	const professionalEnd = professionalStart + professionalMinutesWorking

	const establishmentStart = getMinutesByTime(establishmentStartMinutes)
	const establishmentEnd = establishmentStart + establishmentMinutesWorking

	// Check if professional's working hours are within establishment's working hours
	if (professionalStart < establishmentStart || professionalEnd > establishmentEnd) {
		return false // Professional's working hours are outside of establishment's working hours
	}

	// Check if professional's break time, if exists, overlaps with establishment's break time
	if (
		professionalBreakTime &&
		professionalMinutesBreak &&
		establishmentBreakTime &&
		establishmentMinutesBreak
	) {
		const professionalBreakStart = getMinutesByTime(professionalBreakTime)
		const professionalBreakEnd = professionalBreakStart + professionalMinutesBreak

		const establishmentBreakStart = getMinutesByTime(establishmentBreakTime)
		const establishmentBreakEnd = establishmentBreakStart + establishmentMinutesBreak

		const breaksDiffer = !(
			professionalBreakStart === establishmentBreakStart &&
			professionalBreakEnd === establishmentBreakEnd
		)
		const startsWithinEstablishmentBreak =
			professionalBreakStart >= establishmentBreakStart &&
			professionalBreakStart < establishmentBreakEnd
		const endsWithinEstablishmentBreak =
			professionalBreakEnd > establishmentBreakStart &&
			professionalBreakEnd <= establishmentBreakEnd
		const spansEstablishmentBreak =
			professionalBreakStart <= establishmentBreakStart &&
			professionalBreakEnd >= establishmentBreakEnd

		if (
			breaksDiffer &&
			(startsWithinEstablishmentBreak || endsWithinEstablishmentBreak || spansEstablishmentBreak)
		) {
			return false // Break times overlap
		}
	}

	return true // Professional's schedule fits within establishment's schedule
}
