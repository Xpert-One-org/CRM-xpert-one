'use client';

import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import flags from 'react-phone-number-input/flags';
import FilterSvg from '../svg/FIlterSvg';

export type CountryOption = {
  value: string;
  label: string;
};

type CountryMultiSelectProps = {
  options: CountryOption[];
  selectedValues: string[];
  onValueChange: (values: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  showSelectedOption?: boolean;
};

export default function CountryMultiSelect({
  options,
  selectedValues,
  onValueChange,
  placeholder = 'Sélectionner des pays',
  searchPlaceholder = 'Rechercher un pays...',
  className,
  showSelectedOption,
}: CountryMultiSelectProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (value: string) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onValueChange(newSelectedValues);
  };

  const handleRemove = (valueToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange(selectedValues.filter((value) => value !== valueToRemove));
  };

  const FlagComponent = ({ country }: { country: string }) => {
    const Flag = flags[country as keyof typeof flags];
    return (
      <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-white">
        {Flag && <Flag title={country} />}
      </span>
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'flex h-auto min-h-[42px] w-full flex-wrap items-center justify-center gap-2 bg-chat-selected px-3 py-2 text-black hover:bg-chat-selected',
            className
          )}
        >
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-sm">{placeholder}</span>
            <FilterSvg className="size-4" />
            {selectedValues.length > 0 &&
              showSelectedOption &&
              selectedValues.map((value) => {
                const option = options.find((opt) => opt.value === value);
                return (
                  <Badge
                    key={value}
                    className="flex items-center gap-1 bg-primary text-white"
                  >
                    <FlagComponent country={option?.value ?? ''} />
                    {option?.label}
                    <X
                      className="size-3 cursor-pointer hover:text-destructive"
                      onClick={(e) => handleRemove(value, e)}
                    />
                  </Badge>
                );
              })}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <ScrollArea className="h-[300px]">
              <CommandEmpty>Aucun résultat</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selectedValues.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() => handleSelect(option.value)}
                      className="flex items-center gap-2"
                    >
                      <FlagComponent country={option.value} />
                      <span className="flex-1">{option.label}</span>
                      <Check
                        className={cn(
                          'size-4',
                          isSelected ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
