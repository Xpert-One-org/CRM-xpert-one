export function checkFileExistsForDate(
  files: { year: number; month: number; createdAt: string }[],
  selectedYear: number,
  selectedMonth: number
) {
  const file = files.find(
    (f) => f.year === selectedYear && f.month === selectedMonth
  );
  return {
    exists: !!file,
    createdAt: file?.createdAt,
  };
}
