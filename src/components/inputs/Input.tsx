'use client';
import SearchWBg from '@/components/svg/SearchWBg';
import { cn } from '@/utils/functions/utils';
import { VariantProps, cva } from 'class-variance-authority';
import type { ComponentProps} from 'react';
import React, { useState } from 'react';
import Info from '../Info';
import { Eye, EyeOff, Lock, Mail, X } from 'lucide-react';

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
} & ComponentProps<'input'>

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
  ...props
}: Props) {
  const [isShowing, setIsShowing] = useState(false);

  const placeholderIfNotPrecised = props.type == 'search' ? 'Rechercher' : '';
  const placeholder = props.placeholder ?? placeholderIfNotPrecised;
  return (
    <div className={cn('w-full xl:max-w-[280px]', className)}>
      {label && (
        <label
          htmlFor={props.id}
          className={cn(
            'flex items-center whitespace-nowrap text-sm font-medium text-colors-black',
            classNameLabel
          )}
        >
          {label}
          {props.required && <span className="text-colors-accent">*</span>}
          {explain ? (
            <Info
              fill={fillExplain}
              side={sideEplain}
              className={cn('ml-2 w-fit', classNameExplain)}
            >
              {explain}
            </Info>
          ) : (
            <div className="h-6" />
          )}
        </label>
      )}

      <div
        className={cn(
          'relative flex h-[42px] w-full items-center rounded-xs border-[1px] border-colors-border-gray bg-white transition',
          { 'border-colors-important': hasError },
          { 'hover:border-colors-primary': !hasError && !props.disabled }
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

        {hasPreIcon && props.type === 'password' && (
          <Lock color="black" className="ml-3 outline-none" type="button" />
        )}

        <input
          {...props}
          type={
            props.type === 'password'
              ? isShowing
                ? 'text'
                : 'password'
              : props.type
          }
          placeholder={placeholder}
          className={cn(
            'h-full w-full rounded-xs bg-transparent px-[14px] text-sm font-light outline-none placeholder:text-sm placeholder:font-light placeholder:text-colors-light-gray-third disabled:bg-colors-lightgray-secondary',
            { uppercase: props.id === 'lastname' || uppercase }
          )}
        />
        {props.type === 'search' && (
          <button className="m-[7px] outline-none" type="button">
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
