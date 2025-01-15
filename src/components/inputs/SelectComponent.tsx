import type { ComponentProps } from 'react';
import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

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
  onValueChange: (
    value: string,
    name: string,
    index?: number,
    json_key?: string
  ) => void;
  name: string;
  explain?: React.ReactNode;
  classNameLabel?: string;
  hasError?: boolean;
  disabled?: boolean;
} & ComponentProps<'div'>;

export default function SelectComponent({
  className,
  explain,
  hasError,
  classNameLabel,
  required,
  name,
  onValueChange,
  options,
  placeholder = 'Choisir',
  label,
  defaultSelectedKeys,
  id,
  disabled,
}: Props) {
  const defaultLabel = defaultSelectedKeys
    ? options.find((option) => option.value === defaultSelectedKeys)?.label
    : placeholder;

  const handleValueChange = (value: string) => {
    if (value) {
      onValueChange(value, name);
    }
  };

  return (
    <div className={cn('w-full font-light xl:max-w-[280px]', className)}>
      {label && (
        <Label htmlFor={id} className={cn('flex items-center', classNameLabel)}>
          {label}
          {required && <span className="ml-1 text-accent">*</span>}
        </Label>
      )}
      <Select onValueChange={handleValueChange} name={name} disabled={disabled}>
        <SelectTrigger
          className={cn(
            'h-[42px] rounded-md border border-border-gray bg-white shadow-sm transition duration-200 ease-in-out',
            {
              'border-important': hasError,
              'hover:border-primary': !hasError,
            }
          )}
        >
          <SelectValue className="bg-white" placeholder={defaultLabel} />
        </SelectTrigger>
        <SelectContent className="w-full">
          <SelectGroup>
            {options
              .filter((item) => item.value)
              .map((item, i) => (
                <SelectItem
                  key={`${item.value}-${i}`}
                  value={item.value || ''}
                  className="hover:bg-hover transition duration-150"
                >
                  {item.label}
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
