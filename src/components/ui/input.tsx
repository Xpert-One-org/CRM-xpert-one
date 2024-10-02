'use client';
import * as React from 'react';

import { cn } from '@/lib/utils';
import { Label } from './label';
import { Mail, Lock, EyeOff, Eye } from 'lucide-react';
import { Button } from './button';
import { useState } from 'react';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  required?: boolean;
  hasPreIcon?: boolean;
  hasError?: boolean;
  showPasswordToggle?: boolean;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      required,
      hasPreIcon,
      showPasswordToggle,
      hasError,
      type,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const inputType = showPasswordToggle
      ? showPassword
        ? 'text'
        : 'password'
      : type;
    return (
      <>
        {label && (
          <Label className="-mb-2">
            {label} {required && <span className="text-accent">*</span>}
          </Label>
        )}

        <div className="relative flex items-center">
          <input
            required={required}
            type={inputType}
            className={cn(
              'border-input bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-3 text-sm font-light file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              { 'pl-10': hasPreIcon },
              { 'border-destructive': hasError },
              { 'pr-10': showPasswordToggle },
              className
            )}
            ref={ref}
            {...props}
          />
          {hasPreIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-2 flex items-center pb-px pl-1">
              {type === 'password' && (
                <Lock
                  strokeWidth={1.5}
                  color="black"
                  className="outline-none"
                  size={18}
                  type="button"
                />
              )}
              {type === 'email' && (
                <Mail
                  strokeWidth={1.5}
                  color="black"
                  className="outline-none"
                  size={18}
                  type="button"
                />
              )}
            </div>
          )}
          {showPasswordToggle && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 flex items-center px-3 hover:bg-transparent"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff strokeWidth={1.5} size={20} color="black" />
              ) : (
                <Eye strokeWidth={1.5} size={20} color="black" />
              )}
            </Button>
          )}
        </div>
      </>
    );
  }
);
Input.displayName = 'Input';

export { Input };
