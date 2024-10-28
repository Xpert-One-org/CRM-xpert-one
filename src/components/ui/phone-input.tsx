import { CheckIcon, ChevronsUpDown } from 'lucide-react';

import * as React from 'react';

import * as RPNInput from 'react-phone-number-input';

import flags from 'react-phone-number-input/flags';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { cn } from '@/lib/utils';
import { ScrollArea } from './scroll-area';
import { Button } from './button';

type PhoneInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value'
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, 'onChange'> & {
    onChange?: (value: RPNInput.Value) => void;
    hasError?: boolean;
    defaultValue: string;
  };

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> =
  React.forwardRef<React.ElementRef<typeof RPNInput.default>, PhoneInputProps>(
    ({ className, defaultValue, hasError, onChange, ...props }, ref) => {
      return (
        <RPNInput.default
          ref={ref}
          className={cn('flex text-white', {
            '[&>.input-phone]:border-important': hasError,
          })}
          flagComponent={FlagComponent}
          countrySelectComponent={CountrySelect}
          inputComponent={InputComponent}
          /**
           * Handles the onChange event.
           *
           * react-phone-number-input might trigger the onChange event as undefined
           * when a valid phone number is not entered. To prevent this,
           * the value is coerced to an empty string.
           *
           * @param {E164Number | undefined} value - The entered value
           */
          onChange={(value: any) => onChange?.(value || '')}
          value={defaultValue}
          {...props}
        />
      );
    }
  );
PhoneInput.displayName = 'PhoneInput';

const InputComponent = React.forwardRef<HTMLInputElement>(
  ({ ...props }, ref) => (
    <div
      className={cn(
        'input-phone flex h-[42px] w-full items-center rounded-r-xs border-[1px] border-border-gray bg-white text-black'
      )}
    >
      <input
        {...props}
        className={cn(
          'h-full w-full bg-transparent px-[14px] text-sm font-light outline-none placeholder:text-sm placeholder:font-light placeholder:text-light-gray-third disabled:bg-lightgray-secondary'
        )}
        ref={ref}
      />
    </div>
  )
);
InputComponent.displayName = 'InputComponent';

type CountrySelectOption = { label: string; value: RPNInput.Country };

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
  options: CountrySelectOption[];
};

const CountrySelect = ({
  disabled,
  value,
  onChange,
  options,
}: CountrySelectProps) => {
  const handleSelect = React.useCallback(
    (country: RPNInput.Country) => {
      onChange(country);
    },
    [onChange]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={'outline'}
          defaultValue={'FR'}
          className={cn(
            'flex h-[42px] gap-1 rounded-e-none rounded-s-lg px-3 text-black'
          )}
          disabled={disabled}
        >
          <FlagComponent country={value} countryName={value} />
          <ChevronsUpDown
            className={cn(
              '-mr-2 h-4 w-4 opacity-50',
              disabled ? 'hidden' : 'opacity-100'
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandList>
            <ScrollArea className="h-72">
              <CommandInput placeholder="Rechercher un pays..." />
              <CommandEmpty>Aucun résultat</CommandEmpty>
              <CommandGroup>
                {options
                  .filter((x) => x.value)
                  .map((option, i) => (
                    <CommandItem
                      className="gap-2"
                      key={`${option.value}-${i}`}
                      onSelect={() => handleSelect(option.value)}
                    >
                      <FlagComponent
                        country={option.value}
                        countryName={option.label}
                      />
                      <span className="flex-1 text-sm">{option.label}</span>
                      {option.value && (
                        <span className="text-sm text-foreground/50">
                          {`+${RPNInput.getCountryCallingCode(option.value)}`}
                        </span>
                      )}
                      <CheckIcon
                        className={cn(
                          'ml-auto h-4 w-4',
                          option.value === value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-white">
      {Flag && <Flag title={countryName} />}
    </span>
  );
};
FlagComponent.displayName = 'FlagComponent';

export { PhoneInput };
