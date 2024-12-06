'use client';

import React, { useState, useEffect } from 'react';
import { useSelect } from '@/store/select';
import type { DBXpert, DBXpertOptimized } from '@/types/typesDb';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import FilterSvg from '../svg/FIlterSvg';
import MultiSelectComponent from '../MultiSelectComponent';

type ComboboxJobTitlesProps = {
  data?: DBXpertOptimized[];
  onFilter?: (filteredData: DBXpertOptimized[]) => void;
  selectedValues: string[];
  onValueChange: (values: string[]) => void;
  className?: string;
};

export default function ComboboxJobTitles({
  data,
  onFilter,
  selectedValues,
  onValueChange,
  className,
}: ComboboxJobTitlesProps) {
  const { jobTitles, fetchJobTitles } = useSelect();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchJobTitles();
  }, [fetchJobTitles]);

  const handleValueChange = (
    value: string | string[],
    name: string,
    json_key?: (string | undefined)[]
  ) => {
    onValueChange(value as string[]);

    if (data && onFilter) {
      if (value.length === 0) {
        onFilter(data);
      } else {
        const filteredData = data.filter((xpert) => {
          return (value as string[]).some((value) =>
            xpert.profile_mission?.job_titles?.some((title) => title === value)
          );
        });
        onFilter(filteredData);
      }
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'flex h-full w-full flex-wrap items-center justify-center gap-2 bg-chat-selected px-3 py-2 text-black hover:bg-chat-selected',
            className
          )}
        >
          <div className="flex flex-wrap items-center justify-center gap-1">
            <span className="text-sm">
              {selectedValues.length > 0
                ? `Poste (${selectedValues.length})`
                : 'Poste'}
            </span>
            <FilterSvg className="size-4" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <p className="text-sm">Trier par le type de poste</p>
        <MultiSelectComponent
          options={jobTitles.map((jobTitle) => ({
            value: jobTitle.value || '',
            label: jobTitle.label || '',
          }))}
          defaultSelectedKeys={selectedValues}
          onValueChange={handleValueChange}
          placeholder="Poste"
          className="w-full border-none"
          name="job_titles"
        />
      </PopoverContent>
    </Popover>
  );
}
