import * as React from 'react';
import { Check, ChevronsUpDown, Info } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';

type Props = {
  label?: string;
  children?: React.ReactNode;
  options: {
    id?: number;
    label: string | null;
    value: string | null;
    json_key?: string | null;
  }[];
  defaultSelectedKeys: string | null;
  placeholder?: string;
  required?: boolean;
  onValueChange: (value: string, name: string) => void;
  name: string;
  explain?: React.ReactNode;
  hasError?: boolean;
} & React.ComponentProps<'div'>;

export function Combobox({
  className,
  required,
  hasError,
  name,
  onValueChange,
  explain,
  options,
  placeholder = 'Choisir',
  label,
  defaultSelectedKeys,
  children,
  id,
}: Readonly<Props>) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={cn('w-full xl:max-w-[280px]', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        {label && (
          <Label htmlFor={id} className="flex items-center">
            {label}
            {required && <span className="text-accent">*</span>}
            {explain ? (
              <Info className="ml-2 w-fit">{explain}</Info>
            ) : (
              <div className="h-6" />
            )}
          </Label>
        )}

        <PopoverTrigger asChild>
          <div
            className={cn(
              'flex h-[42px] items-center justify-between rounded-md border border-border-gray bg-white px-4 py-2 text-sm font-light',
              { 'border-important': hasError }
            )}
          >
            {defaultSelectedKeys
              ? options.find(
                  (option) =>
                    option.value?.toLowerCase() ===
                    defaultSelectedKeys.toLowerCase()
                )?.label
              : placeholder}
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Command className="max-h-[300px] font-light">
            <CommandInput placeholder={placeholder} />
            <ScrollArea className="h-[200px] font-light">
              <CommandEmpty>Aucun résultat</CommandEmpty>

              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    className="pr-8"
                    key={option.value}
                    value={option.label ?? ''}
                    onSelect={(currentValue) => {
                      const value = options.find(
                        (option) =>
                          option.label?.toLowerCase() ===
                          currentValue.toLowerCase()
                      )?.value;
                      onValueChange(value ?? '', name);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        defaultSelectedKeys?.toLowerCase() ===
                          option.value?.toLowerCase()
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
