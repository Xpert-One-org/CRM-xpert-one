'use client';
import { cn } from '@/utils/functions/utils';
import type { ComponentProps} from 'react';
import React, { useEffect } from 'react';
import Info from '../Info';

type Props = {
  label?: string;
  uppercase?: boolean;
  explain?: string;
  fillExplain?: string;
  classNameExplain?: string;
  hasError?: boolean;
  sideEplain?: 'left' | 'right' | 'top' | 'bottom';
} & ComponentProps<'textarea'>
export default function TextArea({
  className,
  explain,
  hasError,
  rows = 4,
  fillExplain,
  sideEplain,
  classNameExplain,
  label,
  placeholder,
  uppercase,
  children,
  ...props
}: Readonly<Props>) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const handleInput = () => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    };

    textarea.addEventListener('input', handleInput);

    return () => {
      textarea.removeEventListener('input', handleInput);
    };
  }, []);
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label
          htmlFor={props.id}
          className={cn(
            'flex items-center whitespace-nowrap text-sm font-medium text-colors-black'
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
          'flex w-full items-center rounded-xs border-[1px] border-colors-border-gray bg-white py-3 transition',
          { 'border-colors-important': hasError },
          { 'hover:border-colors-primary': !hasError }
        )}
      >
        <textarea
          {...props}
          rows={rows}
          ref={textareaRef}
          placeholder={placeholder}
          className={cn(
            'h-full w-full resize-none bg-transparent px-[16px] text-sm font-light outline-none placeholder:text-sm placeholder:font-light placeholder:text-colors-light-gray-third disabled:bg-colors-lightgray-secondary',
            { uppercase: props.id === 'lastname' || uppercase }
          )}
        />
      </div>
    </div>
  );
}
