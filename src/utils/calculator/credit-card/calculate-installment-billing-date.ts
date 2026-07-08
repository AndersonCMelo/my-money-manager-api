export function calculateInstallmentBillingDate(
  installmentDate: string,
  closingDay: number,
  dueDay: number,
): string {
  const [year, month, day] = installmentDate.split('-').map(Number)

  // Purchases made after the card closes for the month roll into next month's bill.
  let billingMonthIndex = month - 1
  if (day > closingDay) {
    billingMonthIndex += 1
  }

  const lastDayOfBillingMonth = new Date(
    year,
    billingMonthIndex + 1,
    0,
  ).getDate()
  const billingDay = Math.min(dueDay, lastDayOfBillingMonth)

  const billingDate = new Date(year, billingMonthIndex, billingDay)

  return [
    billingDate.getFullYear(),
    String(billingDate.getMonth() + 1).padStart(2, '0'),
    String(billingDate.getDate()).padStart(2, '0'),
  ].join('-')
}
