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
import { Check, Loader2Icon, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from './ui/label';
import { Badge } from '@/components/ui/badge';
import { getLabel } from '@/utils/getLabel';

type Option = {
  value: string;
  label: string;
};

type MultiCreatableSelectProps = {
  options: Option[];
  optionsOther?: string | null;
  defaultValue?: Option[];
  className?: string;
  classNameLabel?: string;
  isLoading?: boolean;
  mutate?: () => void;
  label?: string;
  name?: string;
  id?: string;
  onChange?: (options: Option[]) => void;
  creatable?: boolean; // New prop to control creatable behavior
};

type State = {
  open: boolean;
  values: string[];
  query: string;
  newOptions: Option[];
};

type Action =
  | { type: 'SET_OPEN'; payload: boolean }
  | { type: 'SET_VALUES'; payload: string[] }
  | { type: 'SET_QUERY'; payload: string }
  | { type: 'SET_NEW_OPTIONS'; payload: Option[] }
  | { type: 'ADD_OPTION'; payload: Option }
  | { type: 'REMOVE_VALUE'; payload: string }
  | { type: 'CLEAR_ALL' };

const matches = (str: string, query: string, exact: boolean = false) =>
  exact
    ? str.toLowerCase() === query.toLowerCase()
    : str.toLowerCase().includes(query.toLowerCase());

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_OPEN':
      return { ...state, open: action.payload };
    case 'SET_VALUES':
      return { ...state, values: action.payload };
    case 'SET_QUERY':
      return { ...state, query: action.payload };
    case 'SET_NEW_OPTIONS':
      return { ...state, newOptions: action.payload };
    case 'ADD_OPTION':
      return {
        ...state,
        newOptions: [...state.newOptions, action.payload],
        values: [...state.values, action.payload.value],
      };
    case 'REMOVE_VALUE':
      return {
        ...state,
        values: state.values.filter((v) => v !== action.payload),
      };
    case 'CLEAR_ALL':
      return {
        ...state,
        values: [],
      };
    default:
      return state;
  }
}

export default function MultiCreatableSelect({
  options,
  optionsOther,
  defaultValue = [],
  className,
  classNameLabel,
  isLoading = false,
  mutate,
  name,
  label,
  id,
  onChange,
  creatable = false, // Default to false for non-creatable behavior
}: MultiCreatableSelectProps) {
  const initialState: State = {
    open: false,
    values: defaultValue.map((opt) =>
      opt.value.includes('Autre') || opt.value.includes('other')
        ? optionsOther || ''
        : opt.value
    ),
    query: '',
    newOptions: options,
  };

  const [state, dispatch] = React.useReducer(reducer, initialState);

  const getOptionByValue = (value: string): Option | undefined => {
    return state.newOptions.find((option) => option.value === value);
  };

  const handleValueChange = (value: string) => {
    const newValues = state.values.includes(value)
      ? state.values.filter((v) => v !== value)
      : [...state.values, value];

    dispatch({ type: 'SET_VALUES', payload: newValues });

    if (onChange) {
      const selectedOptions = newValues.map((v) => {
        const option = getOptionByValue(v);
        return option || { value: v, label: v };
      });
      onChange(selectedOptions);
    }
  };

  const handleNewOption = (query: string) => {
    const newOption = { value: query, label: query };
    dispatch({ type: 'ADD_OPTION', payload: newOption });
    if (onChange) {
      const newOptions = [
        ...state.values.map((v) => getOptionByValue(v)),
        newOption,
      ].filter((opt): opt is Option => !!opt);
      onChange(newOptions);
    }
  };

  const removeValue = (value: string) => {
    dispatch({ type: 'REMOVE_VALUE', payload: value });
    if (onChange) {
      const newOptions = state.values
        .filter((v) => v !== value)
        .map((v) => getOptionByValue(v))
        .filter((opt): opt is Option => !!opt);
      onChange(newOptions);
    }
  };

  const clearAll = () => {
    dispatch({ type: 'CLEAR_ALL' });
    if (onChange) {
      onChange([]);
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
      <input type="hidden" name={name} value={state.values.join(',')} />
      <div className="relative">
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
              className={cn(
                'h-auto min-h-[2.5rem] w-full justify-between bg-white pr-12 font-light hover:border-primary',
                !state.values.length && 'text-muted-foreground'
              )}
              disabled={isLoading}
            >
              <div className="flex flex-wrap items-center gap-1">
                {state.values.length > 0 ? (
                  state.values.map((value) => (
                    <Badge key={value} className="mr-1 font-[300]">
                      {getLabel({
                        value,
                        select: optionsOther
                          ? [
                              ...options,
                              { value: optionsOther, label: optionsOther },
                            ]
                          : options,
                      })}
                      <button
                        className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onClick={() => removeValue(value)}
                      >
                        <X className="size-3 hover:text-foreground" />
                      </button>
                    </Badge>
                  ))
                ) : isLoading ? (
                  <Loader2Icon className="size-4 animate-spin" />
                ) : (
                  ''
                )}
              </div>
              <ChevronDown className="absolute right-3 size-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          {state.values.length > 0 && (
            <button
              className="absolute right-8 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                clearAll();
              }}
            >
              <X className="size-4" />
            </button>
          )}
          <PopoverContent className="max-h-[calc(var(--radix-popover-content-available-height)-2rem)] min-w-[--radix-popover-trigger-width] overflow-auto p-0 font-[400]">
            <Command>
              <CommandInput
                value={state.query}
                onValueChange={(query) =>
                  dispatch({ type: 'SET_QUERY', payload: query })
                }
                placeholder={
                  creatable
                    ? 'Chercher / Ajouter une option...'
                    : 'Chercher une option...'
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
                        dispatch({ type: 'SET_QUERY', payload: '' });
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
                      onSelect={() => handleValueChange(option.value)}
                    >
                      {option.label}
                      <Check
                        className={cn(
                          'ml-auto h-4 w-4',
                          state.values.includes(option.value)
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
    </div>
  );
}
