'use client';

import React, { useState } from 'react';
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

export default function HeaderCalendar() {
  const yearsSince2010 = Array.from(
    { length: new Date().getFullYear() - 2010 + 1 },
    (_, i) => 2010 + i
  ).sort((a, b) => b - a);

  const [yearSelected, setYearSelected] = useState(yearsSince2010[0]);
  const [monthSelected, setMonthSelected] = useState(new Date().getMonth());

  return (
    <>
      <div className="flex flex-col">
        <div className="mt-spaceContainer flex items-center gap-x-spaceSmall gap-y-spaceXXSmall overflow-x-auto md:gap-x-spaceXXSmall lg:justify-evenly">
          <Select onValueChange={(value) => setYearSelected(Number(value))}>
            <SelectTrigger className="h-auto w-fit bg-accent px-5 pb-2.5 pt-3 text-md font-bold text-white">
              <SelectValue placeholder={yearSelected} />
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
            <Select onValueChange={(value) => setMonthSelected(Number(value))}>
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
                    const isFuture =
                      yearSelected > new Date().getFullYear() ||
                      (yearSelected === new Date().getFullYear() &&
                        index > new Date().getMonth());

                    return (
                      <SelectItem
                        key={index}
                        value={String(month.value)}
                        disabled={isFuture}
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
              const isFuture =
                yearSelected > new Date().getFullYear() ||
                (yearSelected === new Date().getFullYear() &&
                  index > new Date().getMonth());
              const isSelected = monthSelected === index;
              return (
                <Button
                  key={index}
                  onClick={() => setMonthSelected(index)}
                  shadow={'container'}
                  hover={'only_brightness'}
                  variant={
                    isFuture
                      ? 'disabled'
                      : isSelected
                        ? 'tertiary'
                        : 'secondary'
                  }
                  className="flex grow items-center justify-center pb-2.5 pt-3 text-center font-bold uppercase disabled:bg-light-gray-third disabled:text-white lg:w-fit"
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
