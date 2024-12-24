export function generateMonthsRange(startDate: string, endDate?: string) {
  const start = new Date(
    new Date(startDate).getFullYear(),
    new Date(startDate).getMonth(),
    1
  );
  const end = endDate
    ? new Date(new Date(endDate).getFullYear(), new Date(endDate).getMonth(), 1)
    : new Date();
  const currentDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  );

  const effectiveEnd =
    end > currentDate
      ? currentDate
      : new Date(end.getFullYear(), end.getMonth() + 1, 0);

  const months: { year: number; month: number }[] = [];
  const current = new Date(start);

  current.setDate(1);

  while (current <= effectiveEnd) {
    months.push({
      year: current.getFullYear(),
      month: current.getMonth(),
    });

    current.setMonth(current.getMonth() + 1, 1);
  }

  return months;
}
