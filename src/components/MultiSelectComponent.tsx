import type { ComponentProps } from 'react';
import React from 'react';
import MultipleSelector from './ui/multiple-selector';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';
import Info from './Info';

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
  explain?: React.ReactNode;
  classNameLabel?: string;
  hasError?: boolean;
  disabled?: boolean;
} & ComponentProps<'div'>;

export default function MultiSelectComponent({
  className,
  hasError,
  classNameLabel,
  explain,
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
      {label && (
        <Label htmlFor={id} className={cn('flex items-center', classNameLabel)}>
          {label}
          {required && <span className="text-accent">*</span>}
          {explain ? (
            <Info className="ml-2 w-fit">{explain}</Info>
          ) : (
            <div className="h-6" />
          )}
        </Label>
      )}

      <MultipleSelector
        hidePlaceholderWhenSelected
        onChange={handleOnChange}
        className={cn(
          'bg-white pr-4 transition',
          { 'border-important': hasError },
          { 'hover:border-primary': !hasError }
        )}
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
