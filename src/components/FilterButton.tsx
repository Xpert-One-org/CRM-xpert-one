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
  options?: (SelectedOption & { color?: string })[];
  onValueChange?: (value: string) => void;
  placeholder?: string;
  filter?: boolean;
  className?: string;
  disabled?: boolean;
  sortable?: boolean;
  data?: any[];
  sortKey?: string;
  onSort?: (sortedData: any[]) => void;
  coloredOptions?: boolean;
  selectedOption?: SelectedOption;
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
  coloredOptions = false,
}: FilterButtonProps) => {
  const [selectedOption, setSelectedOption] = useState<SelectedOption>({
    label: '',
    value: '',
  });

  const compareValues = (valueA: any, valueB: any) => {
    if (!isNaN(Number(valueA)) && !isNaN(Number(valueB))) {
      return Number(valueA) - Number(valueB);
    }

    if (valueA instanceof Date && valueB instanceof Date) {
      return valueA.getTime() - valueB.getTime();
    }

    const strA = String(valueA).toLowerCase();
    const strB = String(valueB).toLowerCase();

    if (strA < strB) return -1;
    if (strA > strB) return 1;
    return 0;
  };

  const handleValueChange = (option: SelectedOption) => {
    setSelectedOption(option);

    if (sortable && data && sortKey && onSort) {
      const sortedData = [...data].sort((a, b) => {
        const valueA = a[sortKey];
        const valueB = b[sortKey];

        if (option.value === 'asc') {
          return compareValues(valueA, valueB);
        } else if (option.value === 'desc') {
          return compareValues(valueB, valueA);
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
              {selectedOption.value !== '' && (
                <Badge
                  style={
                    coloredOptions &&
                    options?.find((opt) => opt.value === selectedOption.value)
                      ?.color
                      ? {
                          backgroundColor: options.find(
                            (opt) => opt.value === selectedOption.value
                          )?.color,
                          color: '#fff',
                        }
                      : undefined
                  }
                >
                  {selectedOption.label}
                </Badge>
              )}
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
