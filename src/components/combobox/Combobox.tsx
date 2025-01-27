'use client';
import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Check, ChevronsUpDown, X } from 'lucide-react';

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
import { Badge } from '../ui/badge';
import { useRouter } from 'next/navigation';

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
  icon?: React.ReactNode;
  showValue?: boolean;
  onClear?: () => void;
  showPlaceholderWithValue?: boolean;
  showSelectedOption?: boolean;
} & React.HTMLAttributes<HTMLButtonElement>;

export default function Combobox({
  data,
  isLoading,
  className,
  showSelectedOption = true,
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
  icon,
  onClear,
  showValue = true,
  showPlaceholderWithValue = true,

  ...props
}: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div>
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
              'flex w-full flex-row items-center justify-center gap-2',
              className,
              { 'border-important': hasError },
              { 'hover:border-primary': !hasError }
            )}
          >
            <div className="flex items-center gap-1">
              {showPlaceholderWithValue ? placeholder : ''}
              {value && showValue && showSelectedOption && (
                <div>
                  <Badge
                    className="flex items-center justify-center gap-1 bg-secondary hover:bg-primary"
                    onClick={() => router.push(`/mission/fiche/${value}`)}
                  >
                    {value}
                    {onClear && (
                      <X
                        className="size-3 cursor-pointer hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          onClear();
                        }}
                      />
                    )}
                  </Badge>
                </div>
              )}
              {icon ? (
                icon
              ) : (
                <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
              )}
            </div>
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className={cn('p-0', classNamePopover)}>
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
