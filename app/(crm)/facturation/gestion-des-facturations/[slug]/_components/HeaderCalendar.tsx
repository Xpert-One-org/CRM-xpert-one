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
import { isMonthDisabled } from '../_utils/isMonthDisabled';
import type { DBMission } from '@/types/typesDb';
import { updateMissionState } from '@functions/missions';

type HeaderCalendarProps = {
  startDate?: Date;
  endDate?: Date;
  onDateChange: (year: number, month: number) => void;
  fileStatuses: FileStatuses;
  missionData: DBMission | undefined;
};

export default function HeaderCalendar({
  startDate,
  endDate,
  onDateChange,
  fileStatuses,
  missionData,
}: HeaderCalendarProps) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const maxYear = Math.min(endDate?.getFullYear() || Infinity, currentYear);

  const yearsSince2010 = Array.from(
    { length: maxYear - 2010 + 1 },
    (_, i) => 2010 + i
  ).sort((a, b) => b - a);

  const [yearSelected, setYearSelected] = useState(
    Math.min(currentYear, maxYear)
  );
  const [monthSelected, setMonthSelected] = useState(
    yearSelected === currentYear ? currentMonth : 0
  );

  const [allMonthFilesValidated, setAllMonthFilesValidated] = useState(false);

  useEffect(() => {
    // Check if all files for non-disabled months are validated across all years
    const checkAllFilesValidated = async () => {
      const startYear = startDate?.getFullYear() ?? 2010;
      const endYear = endDate?.getFullYear() ?? currentYear;
      let allYearsMonths: { year: number; month: string }[] = [];

      // Collect all valid months across all years
      for (let year = startYear; year <= endYear; year++) {
        const validMonths = months
          .filter((month, monthIndex) => {
            const isDisabled = isMonthDisabled(
              year,
              monthIndex,
              startDate ?? new Date(),
              endDate ?? new Date()
            );
            return !isDisabled && isDisabled !== null;
          })
          .map((month) => ({ year, month: month.label }));

        allYearsMonths = [...allYearsMonths, ...validMonths];
      }

      if (allYearsMonths.length === 0) {
        setAllMonthFilesValidated(false);
        return;
      }

      // Check if all files are validated for all valid months across all years
      const allValidated = allYearsMonths.every(({ year, month }) => {
        const monthIndex = months.findIndex((m) => m.label === month);
        return checkMonthFilesStatus(
          fileStatuses,
          year,
          monthIndex,
          missionData
        );
      });

      setAllMonthFilesValidated(allValidated);
      if (allValidated && missionData?.state != 'finished' && missionData?.id) {
        await updateMissionState(missionData?.id.toString(), 'finished');
      }
      if (
        !allValidated &&
        missionData?.state == 'finished' &&
        missionData?.id
      ) {
        await updateMissionState(missionData?.id.toString(), 'in_progress');
      }
    };

    checkAllFilesValidated();
  }, [
    yearSelected,
    startDate,
    endDate,
    fileStatuses,
    missionData,
    currentYear,
  ]);

  useEffect(() => {
    onDateChange(yearSelected, monthSelected);
  }, [yearSelected, monthSelected, onDateChange]);

  return (
    <div className="flex flex-col">
      {allMonthFilesValidated ? (
        <div className="flex flex-col">
          <p>
            Tous les fichiers sont{' '}
            <span className="font-bold text-[#92C6B0]">validés</span>
          </p>
        </div>
      ) : null}

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
              {yearsSince2010.map((year) => (
                <SelectItem
                  key={year}
                  value={String(year)}
                  disabled={year > maxYear}
                >
                  {year}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Version mobile */}
        <div className="flex lg:hidden">
          <Select
            value={String(monthSelected)}
            onValueChange={(value) => setMonthSelected(Number(value))}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={months
                  .find((m, index) => index === monthSelected)
                  ?.label.slice(0, 4)}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {months.map((month, index) => {
                  const disabled = isMonthDisabled(
                    yearSelected,
                    index,
                    startDate ?? new Date(),
                    endDate ?? new Date()
                  );
                  const allFilesExist = checkMonthFilesStatus(
                    fileStatuses,
                    yearSelected,
                    index,
                    missionData
                  );

                  return (
                    <SelectItem
                      key={index}
                      value={String(month.value)}
                      disabled={disabled || disabled === null}
                      className={`${
                        disabled
                          ? 'bg-light-gray-third'
                          : allFilesExist
                            ? 'bg-[#92C6B0]'
                            : 'bg-[#D64242]'
                      }`}
                    >
                      {month.label.slice(0, 4)}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Version desktop */}
        <div className="hidden w-full justify-evenly gap-spaceXXSmall lg:flex">
          {months.map((month, index) => {
            const disabled = isMonthDisabled(
              yearSelected,
              index,
              startDate ?? new Date(),
              endDate ?? new Date()
            );
            const isSelected = monthSelected === index;
            const allFilesExist = checkMonthFilesStatus(
              fileStatuses,
              yearSelected,
              index,
              missionData
            );

            return (
              <Button
                key={index}
                onClick={() => setMonthSelected(index)}
                shadow={'container'}
                hover={'only_brightness'}
                variant={disabled ? 'disabled' : 'secondary'}
                className={`flex grow items-center justify-center p-4 text-center font-bold uppercase ${isSelected ? 'border-4 border-accent' : ''} ${
                  disabled
                    ? 'bg-light-gray-third text-white'
                    : allFilesExist
                      ? 'bg-[#92C6B0]'
                      : 'bg-[#D64242]'
                }`}
                disabled={disabled || disabled === null}
              >
                {month.label.slice(0, 4)}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
