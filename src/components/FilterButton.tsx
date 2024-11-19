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

type FilterButtonProps = {
  options?: { label: string | null; value: string | null }[];
  defaultSelectedKeys?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  filter?: boolean;
  className?: string;
  disabled?: boolean;
};

export const FilterButton = ({
  options,
  defaultSelectedKeys,
  onValueChange,
  placeholder,
  filter = true,
  className,
  disabled = false,
}: FilterButtonProps) => {
  const [selected, setSelected] = useState<string>(defaultSelectedKeys ?? '');

  const handleValueChange = (value: string) => {
    setSelected(value);
    if (onValueChange) {
      onValueChange(value);
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
              {selected || placeholder}
              <div className="size-3">
                <FilterSvg />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white">
            <DropdownMenuLabel>{placeholder}</DropdownMenuLabel>
            {options && options.length > 0 ? (
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
      ) : (
        <>
          <Button
            className={cn(
              `flex h-auto cursor-default items-center gap-x-2 text-wrap bg-chat-selected px-spaceContainer hover:bg-chat-selected`,
              className
            )}
            disabled={disabled}
          >
            {selected || placeholder}
          </Button>
        </>
      )}
    </>
  );
};
