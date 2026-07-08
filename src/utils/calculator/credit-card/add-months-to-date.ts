export function addMonthsToDate(date: string, months: number): string {
  const [year, month, day] = date.split('-').map(Number)

  const targetMonthIndex = month - 1 + months
  const lastDayOfTargetMonth = new Date(year, targetMonthIndex + 1, 0).getDate()
  const targetDay = Math.min(day, lastDayOfTargetMonth)

  const targetDate = new Date(year, targetMonthIndex, targetDay)

  return [
    targetDate.getFullYear(),
    String(targetDate.getMonth() + 1).padStart(2, '0'),
    String(targetDate.getDate()).padStart(2, '0'),
  ].join('-')
}
