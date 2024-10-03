'use client';
import SearchWBg from '@/components/svg/SearchWBg';
import { cn } from '@/utils/functions/utils';
import { VariantProps, cva } from 'class-variance-authority';
import type { ComponentProps } from 'react';
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
  value?: string | null;
  type?: string;
  sideEplain?: 'left' | 'right' | 'top' | 'bottom';
} & ComponentProps<'div'>;

export default function FakeInput({
  className,
  label,
  type,
  fillExplain,
  value = 'Non renseigné',
  uppercase,
  sideEplain,
  classNameExplain,
  hasPreIcon = false,
  classNameLabel,
  explain,
  children,
  ...props
}: Readonly<Props>) {
  return (
    <div className={cn('w-full xl:max-w-[280px]', className)}>
      {label && (
        <label
          htmlFor={props.id}
          className={cn(
            'flex items-center whitespace-nowrap text-sm font-medium text-black',
            classNameLabel
          )}
        >
          {label}
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
          'relative flex min-h-[42px] w-full items-center rounded-xs border-[1px] border-border-gray bg-white py-3'
        )}
      >
        {hasPreIcon && type === 'email' && (
          <Mail
            size={20}
            color="black"
            className="ml-3 outline-none"
            type="button"
          />
        )}
        {hasPreIcon && type === 'password' && (
          <Lock color="black" className="ml-3 outline-none" type="button" />
        )}

        <p
          {...props}
          className={cn(
            'w-full bg-transparent px-[14px] pb-[1px] text-sm font-light outline-none placeholder:text-sm placeholder:font-light placeholder:text-light-gray-third disabled:bg-lightgray-secondary',
            { uppercase: props.id === 'lastname' || uppercase }
          )}
        >
          {value ?? 'Non renseigné'}
        </p>
      </div>
    </div>
  );
}
