import { cn } from '@/lib/utils';
import React from 'react';

type Props = {} & React.SVGProps<SVGSVGElement>;

export default function MailOpen({
  stroke = 'white',
  width = 32,
  height = 32,
  className,
}: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 32 33"
      fill="none"
      className={cn(className, 'group')}
    >
      <path
        d="M27.6015 10.7451L16.6809 5.35511C16.4696 5.25087 16.2371 5.19666 16.0015 5.19666C15.7659 5.19666 15.5335 5.25087 15.3222 5.35511L4.40153 10.7451C3.98287 10.9502 3.6299 11.2684 3.38251 11.6635C3.13512 12.0587 3.00316 12.5152 3.00153 12.9814V24.5195C3.00153 25.9001 4.13528 27.0195 5.53403 27.0195H26.4715C27.8703 27.0195 29.004 25.9001 29.004 24.5195V12.9814C29.0022 12.5149 28.8698 12.0582 28.622 11.663C28.3741 11.2679 28.0207 10.9499 27.6015 10.7451V10.7451Z"
        stroke={stroke}
        strokeWidth="2.00378"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition group-hover:stroke-accent"
      />
      <path
        d="M24.8331 23.0191L16.7543 16.7353C16.491 16.5305 16.167 16.4193 15.8334 16.4193C15.4998 16.4193 15.1757 16.5305 14.9124 16.7353L6.83307 23.0191"
        stroke={stroke}
        strokeWidth="2.00378"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition group-hover:stroke-accent"
      />
      <path
        d="M19.333 18.4583L27.8342 12.0199"
        stroke={stroke}
        strokeWidth="2.00378"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition group-hover:stroke-accent"
      />
      <path
        d="M3.83319 12.0199L12.5219 18.5833"
        stroke={stroke}
        strokeWidth="2.00378"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition group-hover:stroke-accent"
      />
    </svg>
  );
}
