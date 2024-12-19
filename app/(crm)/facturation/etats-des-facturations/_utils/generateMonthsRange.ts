export function generateMonthsRange(startDate: string, endDate?: string) {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  const currentDate = new Date();

  const effectiveEnd = end > currentDate ? currentDate : end;

  const months: { year: number; month: number }[] = [];
  const current = new Date(start);

  while (current <= effectiveEnd) {
    months.push({
      year: current.getFullYear(),
      month: current.getMonth(),
    });
    current.setMonth(current.getMonth() + 1);
  }

  return months;
}
