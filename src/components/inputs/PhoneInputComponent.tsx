import type { ComponentProps } from 'react';
import React from 'react';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';
import Info from '../Info';
import fr from 'react-phone-number-input/locale/fr.json';
import { PhoneInput } from '@components/ui/phone-input';

type Props = {
  label?: string;
  children?: React.ReactNode;
  defaultSelectedKeys: string;
  placeholder?: string;
  required?: boolean;
  onValueChange?: (value: string, name: string, index?: number) => void;
  name: string;
  explain?: React.ReactNode;
  classNameLabel?: string;
  disabled?: boolean;
  value?: string;
  hasError?: boolean;
  className?: string;
} & ComponentProps<'div'>;

export default function PhoneInputComponent({
  className,
  hasError,
  value,
  disabled,
  explain,
  classNameLabel,
  required,
  name,
  onValueChange,
  placeholder = 'Choisir',
  label,
  id,
}: Props) {
  const onChange = (value: string) => {
    onValueChange && onValueChange(value, name);
  };
  return (
    <div
      className={cn('w-full font-light', className, {
        'cursor-not-allowed': disabled,
      })}
    >
      {label && (
        <>
          <Label
            htmlFor={id}
            className={cn('flex items-center', classNameLabel)}
          >
            {label}
            {required && <span className="text-accent">*</span>}
            {explain ? (
              <Info className="ml-2 w-fit">{explain}</Info>
            ) : (
              <div className="" />
            )}
          </Label>
          <PhoneInput
            defaultValue={value ?? ''}
            disabled={disabled}
            name={name}
            hasError={hasError}
            labels={fr}
            placeholder={placeholder}
            defaultCountry="FR"
            onChange={onChange}
            required={required}
          />
        </>
      )}
    </div>
  );
}
