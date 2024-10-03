import { cn } from '@/utils/functions/utils';
import React from 'react';

type Props = {} & React.SVGProps<SVGSVGElement>;

export default function DocumentText({
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
      viewBox="0 0 32 32"
      fill="none"
      className={cn(className, 'group')}
    >
      <path
        d="M26.0052 13.8312V26.0057C26.0052 26.8016 25.6891 27.5648 25.1263 28.1275C24.5636 28.6903 23.8004 29.0064 23.0046 29.0064H9.00151C8.20569 29.0064 7.44246 28.6903 6.87973 28.1275C6.31699 27.5648 6.00085 26.8016 6.00085 26.0057V6.00139C6.00085 5.20556 6.31699 4.44234 6.87973 3.8796C7.44246 3.31687 8.20569 3.00073 9.00151 3.00073H15.1747C15.7051 3.00081 16.2137 3.2115 16.5888 3.58648L25.4195 12.4172C25.7944 12.7922 26.0051 13.3009 26.0052 13.8312Z"
        stroke={stroke}
        strokeWidth="2.00378"
        strokeLinejoin="round"
        className="transition group-hover:stroke-accent"
      />
      <path
        d="M16.0037 3.49951V11.0022C16.0037 11.5328 16.2145 12.0417 16.5897 12.4169C16.9649 12.7922 17.4738 13.0029 18.0044 13.0029H25.5071"
        stroke="white"
        strokeWidth="2.00378"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition group-hover:stroke-accent"
      />
      <path
        d="M11.0023 18.0034H21.0059"
        stroke={stroke}
        strokeWidth="2.00378"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition group-hover:stroke-accent"
      />
      <path
        d="M11.0023 23.0044H21.0059"
        stroke={stroke}
        strokeWidth="2.00378"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition group-hover:stroke-accent"
      />
    </svg>
  );
}
