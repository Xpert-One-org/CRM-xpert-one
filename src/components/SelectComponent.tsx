import type { ComponentProps } from 'react';
import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';
import Info from './Info';

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
        <Label
          htmlFor={id}
          className={cn('mb-2 flex items-center', classNameLabel)}
        >
          {label}
          {required && <span className="text-colors-accent ml-1">*</span>}
          {explain && <Info className="ml-2 w-fit">{explain}</Info>}
        </Label>
      )}
      <Select onValueChange={handleValueChange} name={name} disabled={disabled}>
        <SelectTrigger
          className={cn(
            'h-[42px] rounded-md border bg-white shadow-sm transition duration-200 ease-in-out',
            {
              'border-colors-important': hasError,
              'hover:border-colors-primary': !hasError,
            }
          )}
        >
          <SelectValue className="bg-white" placeholder={defaultLabel} />
        </SelectTrigger>
        <SelectContent className="w-full">
          <SelectGroup>
            {options
              .filter((item) => item.value)
              .map((item) => (
                <SelectItem
                  key={item.value || ''}
                  value={item.value || ''}
                  className="hover:bg-colors-hover transition duration-150"
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
