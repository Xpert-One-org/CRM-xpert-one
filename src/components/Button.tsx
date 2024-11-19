import { cn } from '@/lib/utils';
import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import Link from 'next/link';
import type { ComponentProps } from 'react';
import React from 'react';

type Props = {
  children: React.ReactNode;
  isLink?: boolean;
  href?: string;
} & ComponentProps<'button'> &
  VariantProps<typeof buttonVariants>;

const buttonVariants = cva(
  'w-full px-spaceMediumContainer py-spaceXSmall text-md text-white transition ',
  {
    variants: {
      variant: {
        primary: ' bg-primary',
        tertiary: ' bg-tertiary',
        filter: 'hover:bg-brightness-110 bg-filter text-sm text-black',
        secondary: ' bg-secondary ',
        accent: 'bg-accent',
        previous: 'bg-light-gray-third',
        disabled: ' border-gray-300 bg-gray-300 text-gray-500',
        outline: 'border bg-transparent text-dark',
      },

      shape: {
        default: 'rounded-xs',
        left_bottom: 'rounded-bl-xxl',
        right_bottom: 'rounded-br-xxl',
        top_only: 'rounded-b-none rounded-t-s',
      },
      hover: {
        default:
          'transition hover:scale-105  hover:brightness-110 disabled:transition-none disabled:hover:scale-100 disabled:hover:brightness-100',
        off: '',
        only_brightness: 'hover:brightness-110 disabled:hover:brightness-100',
      },
      minWidth: {
        default: 'min-w-auto',
        on: 'min-w-[213px]',
      },

      shadow: {
        off: 'shadow-none',
        container: 'shadow-container',
      },
      size: {
        md: 'min-w-auto px-[50px]',
      },
    },
    defaultVariants: {
      shadow: 'off',
      variant: 'primary',
      shape: 'default',
      hover: 'default',
    },
  }
);

export default function Button({
  className,
  size,
  children,
  shadow,
  minWidth,
  shape,
  variant,
  hover,
  href,
  isLink,
  ...props
}: Props) {
  const disabled = props.disabled;

  if (isLink && href) {
    return (
      <Link
        href={href}
        className={cn(
          buttonVariants({ variant, shadow, shape, hover, minWidth, size }),
          'text-center',
          className
        )}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      {...props}
      className={cn(
        buttonVariants({ variant, shadow, shape, hover, minWidth, size }),
        className
      )}
      disabled={disabled || variant == 'disabled'}
    >
      {children}
    </button>
  );
}
