'use client';
import SearchWBg from '@/components/svg/SearchWBg';
import type { ComponentProps } from 'react';
import React, { useState } from 'react';
import Info from '../Info';
import { Ban, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  label?: string | React.ReactNode;
  uppercase?: boolean;
  explain?: React.ReactNode;
  classNameLabel?: string;
  hasPreIcon?: boolean;
  classNameExplain?: string;
  fillExplain?: string;
  hasError?: boolean;
  sideEplain?: 'left' | 'right' | 'top' | 'bottom';
  suffix?: string;
  numbersOnly?: boolean;
} & ComponentProps<'input'>;

export default function Input({
  className,
  hasError,
  label,
  fillExplain,
  uppercase,
  sideEplain,
  classNameExplain,
  hasPreIcon = false,
  classNameLabel,
  explain,
  children,
  suffix,
  numbersOnly = false,
  onChange,
  ...props
}: Props) {
  const [isShowing, setIsShowing] = useState(false);

  const placeholderIfNotPrecised = props.type == 'search' ? 'Rechercher' : '';
  const placeholder = props.placeholder ?? placeholderIfNotPrecised;

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (numbersOnly) {
      const value = e.target.value.replace(',', '.'); // Convert comma to point for validation
      // Allow empty string, numbers, one decimal point, and up to 2 decimal places
      if (value === '' || /^-?\d*\.?\d{0,2}$/.test(value)) {
        // Convert back to comma for display
        e.target.value = value.replace('.', ',');
        onChange?.(e);
      }
    } else {
      onChange?.(e);
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label
          htmlFor={props.id}
          className={cn(
            'flex items-center whitespace-nowrap text-sm font-medium text-black',
            classNameLabel
          )}
        >
          {label}
          {props.required && <span className="text-accent">*</span>}
          {explain ? (
            <Info
              fill={fillExplain}
              side={sideEplain}
              className={cn('ml-2 w-fit', classNameExplain)}
            >
              {explain}
            </Info>
          ) : (
            <div className="" />
          )}
        </label>
      )}

      <div
        className={cn(
          'relative flex h-[42px] w-full items-center rounded-xs border-[1px] border-border-gray bg-white transition',
          { 'border-important': hasError },
          { 'bg-gray-100': props.disabled },
          { 'hover:border-primary': !hasError && !props.disabled }
        )}
      >
        {hasPreIcon && props.type === 'email' && (
          <Mail
            size={20}
            color="black"
            className="ml-3 outline-none"
            type="button"
          />
        )}

        {hasPreIcon && props.disabled && (
          <Ban
            color="black"
            className="mx-3 bg-transparent outline-none"
            type="button"
          />
        )}

        {hasPreIcon && props.type === 'password' && (
          <Lock color="black" className="ml-3 outline-none" type="button" />
        )}

        <div className="relative flex h-full flex-1">
          <input
            {...props}
            onChange={handleNumberInput}
            type={numbersOnly ? 'text' : props.type}
            inputMode={numbersOnly ? 'decimal' : undefined}
            placeholder={placeholder}
            className={cn(
              'h-full w-full rounded-xs bg-white px-[14px] text-sm font-light outline-none placeholder:text-sm placeholder:font-light placeholder:text-light-gray-third disabled:bg-lightgray-secondary',
              { uppercase: props.id === 'lastname' || uppercase },
              { 'cursor-not-allowed': props.disabled },
              { 'pr-6': suffix && numbersOnly } // Add padding for suffix
            )}
          />
          {suffix && numbersOnly && (
            <span className="pointer-events-none absolute right-[14px] top-1/2 -translate-y-1/2 text-sm text-gray-500">
              {suffix}
            </span>
          )}
        </div>
        {/* Move non-number suffix outside the input wrapper */}
        {suffix && !numbersOnly && (
          <span className="mr-3 text-sm text-gray-500">{suffix}</span>
        )}
        {props.type === 'search' && (
          <button
            title="Rechercher"
            className="m-[7px] outline-none"
            type="button"
          >
            <SearchWBg className="" />
          </button>
        )}
        {props.type === 'password' && (
          <button
            className="mx-3 outline-none"
            type="button"
            onClick={() => setIsShowing(!isShowing)}
          >
            {!isShowing && <Eye size={20} />}
            {isShowing && <EyeOff size={20} />}
          </button>
        )}
      </div>
    </div>
  );
}
