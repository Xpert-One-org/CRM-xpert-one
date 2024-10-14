import { cn } from '@/lib/utils';
import React from 'react';

type Props = {} & React.SVGProps<SVGSVGElement>

export default function BubbleNotif({ className }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1013 585"
      preserveAspectRatio="none"
      fill="none"
      className={cn('absolute inset-0 h-full w-full', className)}
    >
      <g filter="url(#filter0_d_1381_10166)">
        <path
          d="M2 50C2 38.9543 10.9543 30 22 30H504.5H820.162C823.221 30 826.24 29.298 828.986 27.948L877.539 4.07652C887.649 -0.894395 899.869 3.46283 904.553 13.7093L906.658 18.3152C909.913 25.4339 917.021 30 924.848 30H987C998.046 30 1007 38.9543 1007 50V559C1007 570.046 998.046 579 987 579H22C10.9543 579 2 570.046 2 559V50Z"
          fill="white"
        />
        <path
          d="M2 50C2 38.9543 10.9543 30 22 30H504.5H820.162C823.221 30 826.24 29.298 828.986 27.948L877.539 4.07652C887.649 -0.894395 899.869 3.46283 904.553 13.7093L906.658 18.3152C909.913 25.4339 917.021 30 924.848 30H987C998.046 30 1007 38.9543 1007 50V559C1007 570.046 998.046 579 987 579H22C10.9543 579 2 570.046 2 559V50Z"
          fill="white"
        />
        <path
          d="M829.207 28.3967L877.76 4.52522C886.385 0.284408 896.585 3.00691 902.06 10.4465C902.842 11.5093 903.527 12.6684 904.098 13.9172L906.204 18.5231C909.539 25.8198 916.825 30.5 924.848 30.5H987C997.77 30.5 1006.5 39.2304 1006.5 50V559C1006.5 569.77 997.77 578.5 987 578.5H22C11.2305 578.5 2.5 569.77 2.5 559V50C2.5 39.2305 11.2304 30.5 22 30.5H504.5H820.162C823.298 30.5 826.392 29.7804 829.207 28.3967Z"
          stroke="#E1E1E1"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_1381_10166"
          x="0"
          y="0.0195312"
          width="1013"
          height="584.98"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="2" dy="2" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_1381_10166"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_1381_10166"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}
