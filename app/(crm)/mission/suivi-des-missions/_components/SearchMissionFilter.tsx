import React from 'react';
import { useDebounce } from 'use-debounce';
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
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FilterMission } from '@/store/mission';
import { useMissionStore } from '@/store/mission';

type SearchMissionFilterProps = {
  placeholder: string;
  filterKey: keyof FilterMission;
  placeholderSearch?: string;
  options: { label: string; value: string }[];
};

export default function SearchMissionFilter({
  placeholderSearch = 'Rechercher',
  placeholder,
  filterKey,
  options,
}: SearchMissionFilterProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [search, setSearch] = React.useState('');
  const [debouncedSearch] = useDebounce(search, 500);

  const { activeFilters, setActiveFilters } = useMissionStore();

  const handleSelect = (currentValue: string) => {
    const values = activeFilters[filterKey];
    if (Array.isArray(values)) {
      const newValues = values.includes(currentValue)
        ? values.filter((v) => v !== currentValue)
        : [...values, currentValue];

      setActiveFilters({
        ...activeFilters,
        [filterKey]: newValues,
      });
    }
    setValue(currentValue);
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="min-w-[200px] justify-between"
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder={placeholderSearch}
            value={search}
            onValueChange={setSearch}
          />
          <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
          <CommandGroup>
            {filteredOptions.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={() => handleSelect(option.value)}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    activeFilters[filterKey].includes(option.value)
                      ? 'opacity-100'
                      : 'opacity-0'
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
