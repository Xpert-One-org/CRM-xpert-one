export const isMonthDisabled = (
  year: number,
  monthIndex: number,
  missionStartDate: Date,
  missionEndDate: Date
) => {
  const currentDate = new Date();
  if (!missionStartDate) return false;

  const selectedDate = new Date(year, monthIndex, 1);

  const startMonth = new Date(
    missionStartDate.getFullYear(),
    missionStartDate.getMonth(),
    1
  );

  const endMonth =
    missionEndDate &&
    new Date(missionEndDate.getFullYear(), missionEndDate.getMonth() + 1, 1);

  const isFuture = selectedDate > currentDate;
  const isBeforeMissionStart = selectedDate < startMonth;
  const isAfterMissionEnd = endMonth && selectedDate >= endMonth;

  if (startMonth > currentDate) {
    return true;
  }

  if (missionEndDate && missionEndDate < currentDate) {
    return isBeforeMissionStart || isAfterMissionEnd;
  }

  return isBeforeMissionStart || isFuture;
};
