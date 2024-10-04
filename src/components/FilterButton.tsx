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

type FilterButtonProps = {
  options: { label: string | null; value: string | null }[];
  defaultSelectedKeys: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
};

export const FilterButton = ({
  options,
  defaultSelectedKeys,
  onValueChange,
  placeholder,
}: FilterButtonProps) => {
  const [selected, setSelected] = useState<string>(defaultSelectedKeys);

  const handleValueChange = (value: string) => {
    setSelected(value);
    onValueChange(value);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="filter"
          className="flex h-auto max-w-[200px] items-center gap-x-2 text-wrap bg-chat-selected font-bold"
        >
          {selected || placeholder}
          <div className="size-3">
            <FilterSvg />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{placeholder}</DropdownMenuLabel>
        {options.length > 0 ? (
          options.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleValueChange(option.value ?? '')}
            >
              {option.label}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>Aucun résultat</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
