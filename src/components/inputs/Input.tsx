'use client';
import SearchWBg from '@/components/svg/SearchWBg';
import type { ComponentProps } from 'react';
import React, { useState } from 'react';
import Info from '../Info';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
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
  ...props
}: Props) {
  const [isShowing, setIsShowing] = useState(false);

  const placeholderIfNotPrecised = props.type == 'search' ? 'Rechercher' : '';
  const placeholder = props.placeholder ?? placeholderIfNotPrecised;
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
            <div className="h-6" />
          )}
        </label>
      )}

      <div
        className={cn(
          'relative flex h-[42px] w-full items-center rounded-xs border-[1px] border-border-gray bg-white transition',
          { 'border-important': hasError },
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
            'h-full w-full rounded-xs bg-transparent px-[14px] text-sm font-light outline-none placeholder:text-sm placeholder:font-light placeholder:text-light-gray-third disabled:bg-lightgray-secondary',
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
