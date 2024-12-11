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
  disabledProposals?: boolean;
  onClear?: () => void;
} & React.HTMLAttributes<HTMLButtonElement>;

export default function Combobox({
  data,
  isLoading,
  disabledProposals,
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
  icon,
  onClear,
  ...props
}: Props) {
  const [open, setOpen] = useState(false);

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
              'flex w-full flex-row flex-wrap items-center justify-center gap-2 overflow-x-hidden p-0 px-2',
              className,
              { 'border-important': hasError },
              { 'hover:border-primary': !hasError }
            )}
          >
            <div className="flex items-center gap-1">
              {placeholder}
              {icon ? (
                icon
              ) : (
                <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
              )}
            </div>
            {value && disabledProposals && (
              <Badge className="flex items-center justify-center gap-1">
                {disabledProposals ? value : data.find((d) => d === value)}
                {onClear && (
                  <div>
                    <X
                      className="size-3 cursor-pointer hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        onClear();
                      }}
                    />
                  </div>
                )}
              </Badge>
            )}
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className={cn('p-0', classNamePopover)}
        align="start"
        sideOffset={5}
      >
        <Command>
          <CommandInput
            placeholder={placeholderSearch ?? placeholder}
            onValueChange={handleValueChange}
          />
          <CommandList className={cn({ hidden: disabledProposals })}>
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
