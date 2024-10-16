'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@/lib/utils';

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    textValue?: string;
  }
>(({ textValue, className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex w-full touch-none select-none items-center',
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-fond-gray">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
      <p>Ok</p>
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block size-5 cursor-pointer rounded-full bg-accent transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
      {textValue && (
        <span className="absolute left-[50%] top-5 w-fit -translate-x-[50%] whitespace-nowrap text-xs">
          {textValue}
        </span>
      )}
    </SliderPrimitive.Thumb>
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
