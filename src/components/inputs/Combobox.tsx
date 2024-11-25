'use client';
import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { cn } from '@/lib/utils';
import { Label } from '../ui/label';

type Props = {
  data: string[];
  value: string;
  handleSetValue: (value: string) => void;
  classNamePopover?: string;
  placeholder?: string;
  placeholderSearch?: string;
  label?: string;
  isLoading?: boolean;
  handleValueChange?: (value: string) => void;
  required?: boolean;
  name?: string;
  hasError?: boolean;
} & React.HTMLAttributes<HTMLButtonElement>;

export default function Combobox({
  data,
  isLoading,
  className,
  value,
  handleSetValue,
  placeholder,
  placeholderSearch,
  handleValueChange,
  classNamePopover,
  label,
  required,
  name,
  hasError,
  ...props
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="flex flex-col gap-1">
          {label && (
            <Label>
              {label}
              {required && <span className="text-accent">*</span>}
            </Label>
          )}
          <Button
            {...props}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'w-full justify-between',
              className,
              { 'border-important': hasError },
              { 'hover:border-primary': !hasError }
            )}
          >
            {value && data.find((d) => d === value)
              ? data.find((d) => d === value)
              : placeholder}
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className={cn('w-full p-0', classNamePopover)}>
        <Command>
          <CommandInput
            placeholder={placeholderSearch ?? placeholder}
            onValueChange={handleValueChange}
          />
          <CommandList>
            {isLoading ? (
              <CommandEmpty>Chargement...</CommandEmpty>
            ) : (
              <>
                <CommandEmpty>Aucun résultat</CommandEmpty>
                <CommandGroup>
                  {data.map((d) => (
                    <CommandItem
                      key={d}
                      value={d}
                      onSelect={(currentValue) => {
                        handleSetValue(currentValue);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          value === d ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {d}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
