'use client';
import React, { useState } from 'react';
import { Button } from './ui/button';
import FilterSvg from './svg/FIlterSvg';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

export type SortOrder = 'asc' | 'desc' | null;

export type SelectedOption = { label: string; value: string };

type FilterButtonProps = {
  options?: SelectedOption[];
  onValueChange?: (value: string) => void;
  placeholder?: string;
  filter?: boolean;
  className?: string;
  disabled?: boolean;
  sortable?: boolean;
  data?: any[];
  sortKey?: string;
  onSort?: (sortedData: any[]) => void;
};

export const FilterButton = ({
  options,
  onValueChange,
  placeholder,
  filter = true,
  className,
  disabled = false,
  sortable = false,
  data,
  sortKey,
  onSort,
}: FilterButtonProps) => {
  const [selectedOption, setSelectedOption] = useState<SelectedOption>({
    label: '',
    value: '',
  });

  const handleValueChange = (option: SelectedOption) => {
    setSelectedOption(option);
    if (sortable && data && sortKey && onSort) {
      const sortedData = [...data].sort((a, b) => {
        const valueA = (a[sortKey] || '').toLowerCase();
        const valueB = (b[sortKey] || '').toLowerCase();

        if (option.value === 'asc') {
          return valueA.localeCompare(valueB);
        } else if (option.value === 'desc') {
          return valueB.localeCompare(valueA);
        }
        return 0;
      });

      onSort(option.value === '' ? data : sortedData);
    }

    if (onValueChange) {
      onValueChange(option.value);
    }
  };

  return (
    <>
      {filter ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className={cn(
                `flex h-auto cursor-default items-center gap-x-2 text-wrap bg-chat-selected px-spaceContainer font-bold hover:bg-chat-selected`,
                className
              )}
            >
              {placeholder}
              <div className="size-3">
                <FilterSvg />
              </div>
              {selectedOption.value !== '' ? (
                <Badge>{selectedOption.label}</Badge>
              ) : null}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white">
            <DropdownMenuLabel>{placeholder}</DropdownMenuLabel>
            {options && options.length > 0 ? (
              options.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() =>
                    handleValueChange({
                      label: option.label || '',
                      value: option.value || '',
                    })
                  }
                >
                  {option.label || ''}
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled>Aucun résultat</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <Button
            className={cn(
              `flex h-auto cursor-default items-center gap-x-2 text-wrap bg-chat-selected px-spaceContainer hover:bg-chat-selected`,
              className
            )}
            disabled={disabled}
          >
            {placeholder}
          </Button>
        </>
      )}
    </>
  );
};
