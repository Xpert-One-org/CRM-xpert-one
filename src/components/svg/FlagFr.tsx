import React from 'react';

type Props = {} & React.SVGProps<SVGSVGElement>

export default function FlagFr({
  fill = 'white',
  stroke,
  width = 32,
  height = 32,
  style,
  className,
}: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 42 36"
      fill="none"
      className={className}
    >
      <g filter="url(#filter0_d_482_3964)">
        <path d="M8 8H34V28H8V8Z" fill="white" />
        <path d="M8 8H17V28H8V8Z" fill="#1E50A0" />
        <path d="M25 8H34V28H25V8Z" fill="#D22F27" />
      </g>
      <defs>
        <filter
          id="filter0_d_482_3964"
          x="0"
          y="0"
          width="42"
          height="36"
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
          <feOffset />
          <feGaussianBlur stdDeviation="4" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_482_3964"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_482_3964"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}
