import { cn } from '@/lib/utils';
import React from 'react';

type Props = {} & React.SVGProps<SVGSVGElement>;

export default function Selection({
  width = 32,
  height = 32,
  className,
}: Props) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill="none"
      className={cn(className, 'transition group-hover:stroke-accent')}
    >
      <path
        d="M11.6667 1.99976H19.6667M26.3333 5.99976V1.99976H22.3333M9 1.99976H5V5.99976M5 19.3331V23.3331H9M26.3333 8.66642V13.9998M5 16.6664V8.66642M26.584 26.6291L22.3333 29.9998L17.6667 23.9998L13.6667 28.6664L10.3333 9.99976L27.6667 18.6664L21.6667 20.6664L26.584 26.6291Z"
        stroke="white"
        strokeWidth="2"
      />
    </svg>
  );
}
