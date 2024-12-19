'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Button from '@/components/Button';
import { months } from '@/data/date';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { FileStatuses } from '@/types/mission';
import { checkMonthFilesStatus } from '../_utils/checkMonthFilesStatus';

type HeaderCalendarProps = {
  startDate?: string;
  onDateChange: (year: number, month: number) => void;
  fileStatuses: FileStatuses;
  missionXpertAssociatedStatus: string;
};

export default function HeaderCalendar({
  startDate,
  onDateChange,
  fileStatuses,
  missionXpertAssociatedStatus,
}: HeaderCalendarProps) {
  const missionStartDate = useMemo(
    () => (startDate ? new Date(startDate) : null),
    [startDate]
  );
  const missionStartYear = missionStartDate?.getFullYear();

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const maxYear =
    missionStartYear && missionStartYear > currentYear
      ? missionStartYear
      : currentYear;

  const yearsSince2010 = Array.from(
    { length: maxYear - 2010 + 1 },
    (_, i) => 2010 + i
  ).sort((a, b) => b - a);

  const [yearSelected, setYearSelected] = useState(currentYear);
  const [monthSelected, setMonthSelected] = useState(currentMonth);

  const isMonthDisabled = (year: number, monthIndex: number) => {
    if (!missionStartDate) return false;

    const isFuture = year > maxYear || (year === maxYear && monthIndex > 11);

    const isBeforeMissionStart =
      year < missionStartDate.getFullYear() ||
      (year === missionStartDate.getFullYear() &&
        monthIndex < missionStartDate.getMonth());

    return isFuture || isBeforeMissionStart;
  };

  useEffect(() => {
    onDateChange(yearSelected, monthSelected);
  }, [yearSelected, monthSelected, onDateChange]);

  return (
    <>
      <div className="flex flex-col">
        <div className="mt-spaceContainer flex items-center gap-x-spaceSmall gap-y-spaceXXSmall overflow-x-auto md:gap-x-spaceXXSmall lg:justify-evenly">
          <Select
            value={String(yearSelected)}
            onValueChange={(value) => setYearSelected(Number(value))}
          >
            <SelectTrigger className="h-auto w-fit bg-accent px-5 pb-2.5 pt-3 text-md font-bold text-white">
              <SelectValue placeholder={String(yearSelected)} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {yearsSince2010.map((year, index) => {
                  return (
                    <SelectItem key={index} value={String(year)}>
                      {year}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>

          <div className="flex lg:hidden">
            <Select
              value={String(monthSelected)}
              onValueChange={(value) => setMonthSelected(Number(value))}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={months
                    .find((m, index) => index == monthSelected)
                    ?.label.slice(0, 4)}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {months.map((month, index) => {
                    const disabled = isMonthDisabled(yearSelected, index);
                    const allFilesExist = checkMonthFilesStatus(
                      fileStatuses,
                      yearSelected,
                      index,
                      missionXpertAssociatedStatus
                    );

                    return (
                      <SelectItem
                        key={index}
                        value={String(month.value)}
                        disabled={disabled}
                        className={`${allFilesExist ? 'bg-[#92C6B0]' : 'bg-[#D64242]'}`}
                      >
                        {month.label.slice(0, 4)}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="hidden w-full justify-evenly gap-spaceXXSmall lg:flex">
            {months.map((month, index) => {
              const disabled = isMonthDisabled(yearSelected, index);
              const isSelected = monthSelected === index;
              const allFilesExist = checkMonthFilesStatus(
                fileStatuses,
                yearSelected,
                index,
                missionXpertAssociatedStatus
              );

              return (
                <Button
                  key={index}
                  onClick={() => setMonthSelected(index)}
                  shadow={'container'}
                  hover={'only_brightness'}
                  variant={disabled ? 'disabled' : 'secondary'}
                  className={`flex grow items-center justify-center p-4 text-center font-bold uppercase disabled:bg-light-gray-third disabled:text-white lg:w-fit ${isSelected ? 'border-4 border-accent' : ''} ${!disabled && allFilesExist ? 'bg-[#92C6B0]' : !disabled ? 'bg-[#D64242]' : ''}`}
                  disabled={disabled}
                >
                  {month.label.slice(0, 4)}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
