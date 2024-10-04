'use client';

import Upload from '@/components/svg/Upload';
import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';
import React from 'react';

type Props = {
  label?: string | React.ReactNode;
  fileName?: string;
  hasError?: boolean;
  classNameInput?: string;
  isDownload?: boolean;
  download?: () => void;
} & ComponentProps<'input'>;

export default function FileInput({
  onChange,
  hasError,
  classNameInput,
  className,
  placeholder = 'CV.png',
  label,
  fileName,
  children,
  download,
  isDownload,
  ...props
}: Props) {
  return (
    <div className={cn('w-full xl:max-w-[280px]', classNameInput)}>
      {label && (
        <label htmlFor={props.id} className="text-sm font-medium text-black">
          {label}
          {props.required && <span className="text-accent">*</span>}
        </label>
      )}
      <label
        className={cn(
          'flex h-[42px] min-w-[165px] items-center rounded-xs border-[1px] border-border-gray bg-white transition',
          className,
          { 'border-important': hasError },
          { 'hover:border-primary': !hasError }
        )}
      >
        {fileName ? (
          <div className="w-full bg-transparent px-spaceMediumContainer text-sm font-light outline-none placeholder:text-sm placeholder:font-light placeholder:text-light-gray-third">
            {fileName}
          </div>
        ) : (
          <div className="w-full bg-transparent px-spaceMediumContainer text-sm font-light text-light-gray-third outline-none placeholder:text-sm">
            {placeholder}
          </div>
        )}
        <input
          {...props}
          onClick={isDownload ? download : undefined}
          onChange={!isDownload ? onChange : undefined}
          type={isDownload ? 'button' : 'file'}
          accept="image/*,.pdf,.doc,.docx"
          className="hidden"
        />
        <div className="m-[7px] rounded-xxs bg-lightgray-secondary p-1 outline-none">
          <Upload
            onClick={isDownload ? download : undefined}
            className={isDownload ? 'stroke-primary' : ''}
          />
        </div>
      </label>
    </div>
  );
}
