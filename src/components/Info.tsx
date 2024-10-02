import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@components/ui/popover';
import InfoSvg from './svg/InfoSvg';
import { Label } from '@components/ui/label';
import { cn } from '@/lib/utils';

type Props = {
  children: React.ReactNode;
  side?: 'left' | 'right' | 'top' | 'bottom';
  fill?: string;
  color?: 'primary' | 'light' | 'important';
} & React.ComponentProps<'div'>

export default function Info({
  children,
  side = 'bottom',
  fill,
  className,
  color = 'primary',
}: Props) {
  const fillDefault =
    color == 'light'
      ? '#D0DDE1'
      : color === 'important'
        ? '#D64242'
        : '#248a8d';
  return (
    <Popover>
      <PopoverTrigger className={className} asChild>
        <Label>
          <InfoSvg
            className="cursor-pointer"
            width={18}
            fill={fill ?? fillDefault}
          />
        </Label>
      </PopoverTrigger>
      <PopoverContent
        side={side}
        className={cn(
          'mx-4 w-fit max-w-[50vw] rounded-lg border-transparent bg-colors-primary px-3 py-2 font-fira text-sm font-light text-white',
          { 'bg-[#D0DDE1] text-black': color == 'light' },
          { 'bg-colors-important': color == 'important' }
        )}
      >
        {children}
      </PopoverContent>
    </Popover>
  );
}
