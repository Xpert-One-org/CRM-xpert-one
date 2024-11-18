import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';
import React from 'react';

type Props = {
  className?: string;
} & ComponentProps<'div'>;

export default function Separator({ className }: Props) {
  return <div className={cn('bg h-[1px] bg-light-gray-third', className)} />;
}
