import type { ComponentProps } from 'react';
import React from 'react';
import { cn } from '@/lib/utils';
import { Label } from '../ui/label';
import MultipleSelector from '../ui/multiple-selector';

type Props = {
  label?: string;
  children?: React.ReactNode;
  options: any[];
  defaultSelectedKeys: string[] | null;
  placeholder?: string;
  required?: boolean;
  onValueChange: (
    value: string | string[],
    name: string,
    json_key: (string | undefined)[]
  ) => void;
  name: string;
  classNameLabel?: string;
  hasError?: boolean;
  disabled?: boolean;
} & ComponentProps<'div'>;

export default function MultiSelectComponent({
  className,
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
  const handleOnChange = (options: any[] | undefined) => {
    const values = options ? options.map((option) => option.value) : [];
    const json_keys = options ? options.map((option) => option.json_key) : [];
    onValueChange(values, name, json_keys);
  };

  const defaultsOptions = options.filter((option) =>
    defaultSelectedKeys?.includes(option.value || '')
  );

  return (
    <div className={cn('w-full font-light xl:max-w-[280px]', className)}>
      <label
        htmlFor={id}
        className={cn(
          'flex items-center whitespace-nowrap text-sm font-medium text-black',
          classNameLabel
        )}
      >
        <div className="h-6" />
        {label}
      </label>

      <MultipleSelector
        hidePlaceholderWhenSelected
        onChange={handleOnChange}
        className={cn('bg-white pr-4 transition', {
          'bg-lightgray-secondary': disabled,
        })}
        badgeClassName=""
        value={defaultsOptions}
        options={options}
        placeholder={placeholder}
        emptyIndicator={
          <p className="text-center text-sm text-gray-600">Aucun résultat</p>
        }
        disabled={disabled}
      />
    </div>
  );
}
