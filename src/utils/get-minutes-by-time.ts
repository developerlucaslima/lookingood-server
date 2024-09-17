export function getMinutesByTime(time: string): number {
	const [hourStr, minuteStr] = time.split(':')
	const hourInt = Number.parseInt(hourStr, 10) * 60
	const minutesInt = Number.parseInt(minuteStr, 10)

	return hourInt + minutesInt
}
