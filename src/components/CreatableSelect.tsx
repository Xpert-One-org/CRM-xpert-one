import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, Loader2Icon, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from './ui/label';
import { getLabel } from '@/utils/getLabel';

type Option = {
  value: string;
  label: string;
};

type CreatableSelectProps = {
  options: Option[];
  optionsOther?: string | null;
  defaultValue?: Option;
  className?: string;
  classNameLabel?: string;
  isLoading?: boolean;
  mutate?: () => void;
  label?: string;
  name?: string;
  id?: string;
  onChange?: (option: Option) => void;
  creatable?: boolean; // New prop to control creatable behavior
};

type State = {
  open: boolean;
  value: string;
  query: string;
  newOptions: Option[];
};

type Action =
  | { type: 'SET_OPEN'; payload: boolean }
  | { type: 'SET_VALUE'; payload: string }
  | { type: 'SET_QUERY'; payload: string }
  | { type: 'SET_NEW_OPTIONS'; payload: Option[] }
  | { type: 'ADD_OPTION'; payload: Option };

const matches = (str: string, query: string, exact: boolean = false) =>
  exact
    ? str.toLowerCase() === query.toLowerCase()
    : str.toLowerCase().includes(query.toLowerCase());

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_OPEN':
      return { ...state, open: action.payload };
    case 'SET_VALUE':
      return { ...state, value: action.payload };
    case 'SET_QUERY':
      return { ...state, query: action.payload };
    case 'SET_NEW_OPTIONS':
      return { ...state, newOptions: action.payload };
    case 'ADD_OPTION':
      return {
        ...state,
        newOptions: [...state.newOptions, action.payload],
        value: action.payload.value,
      };
    default:
      return state;
  }
}

export default function CreatableSelect({
  options,
  optionsOther,
  defaultValue,
  className,
  classNameLabel,
  isLoading = false,
  mutate,
  name,
  label,
  id,
  onChange,
  creatable = false, // Default to false for non-creatable behavior
}: CreatableSelectProps) {
  const initialState: State = {
    open: false,
    value:
      (defaultValue?.value.includes('Autre') ||
        defaultValue?.value.includes('other')) &&
      optionsOther
        ? optionsOther
        : defaultValue?.value || '',
    query: '',
    newOptions: options,
  };

  const [state, dispatch] = React.useReducer(reducer, initialState);

  const getOptionByValue = (value: string): Option | undefined => {
    return state.newOptions.find((option) => option.value === value);
  };

  const handleValueChange = (value: string) => {
    dispatch({ type: 'SET_VALUE', payload: value });
    const selectedOption = getOptionByValue(value);
    if (selectedOption && onChange) {
      onChange(selectedOption);
    }
  };

  const handleNewOption = (query: string) => {
    const newOption = { value: query, label: query };
    dispatch({ type: 'ADD_OPTION', payload: newOption });
    if (onChange) {
      onChange(newOption);
    }
  };

  React.useEffect(() => {
    mutate?.();
    dispatch({ type: 'SET_QUERY', payload: '' });
  }, [options, mutate]);

  return (
    <div className={cn('w-full font-light', className)}>
      {label && (
        <Label htmlFor={id} className={cn('flex items-center', classNameLabel)}>
          {label}
        </Label>
      )}
      <input className="hidden" type="hidden" name={name} value={state.value} />
      <Popover
        open={state.open}
        onOpenChange={(open) => dispatch({ type: 'SET_OPEN', payload: open })}
      >
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={state.open}
            className="w-full justify-between bg-white font-light hover:border-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              getLabel({
                value: state.value,
                select: optionsOther
                  ? [...options, { value: optionsOther, label: optionsOther }]
                  : options,
              }) || ''
            )}
            <ChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="max-h-[calc(var(--radix-popover-content-available-height)-2rem)] min-w-[--radix-popover-trigger-width] overflow-auto p-0">
          <Command>
            <CommandInput
              value={state.query}
              onValueChange={(query) =>
                dispatch({ type: 'SET_QUERY', payload: query })
              }
              placeholder={
                creatable ? 'Chercher / Ajouter une option...' : 'Rechercher...'
              }
              className="h-9"
            />
            <CommandGroup>
              {creatable &&
                state.query &&
                !state.newOptions.some((option) =>
                  matches(option.label, state.query, true)
                ) && (
                  <CommandItem
                    key={state.query}
                    value={state.query}
                    onSelect={() => {
                      handleNewOption(state.query);
                      dispatch({ type: 'SET_OPEN', payload: false });
                    }}
                  >
                    Créer "{state.query}"
                  </CommandItem>
                )}
              {state.newOptions
                .filter((option) => matches(option.label, state.query))
                .filter((option) => option.value !== '')
                .map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    className="font-[300]"
                    onSelect={() => {
                      handleValueChange(option.value);
                      dispatch({ type: 'SET_OPEN', payload: false });
                    }}
                  >
                    {option.label}
                    <Check
                      className={cn(
                        'ml-auto h-4 w-4',
                        state.value === option.value
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
