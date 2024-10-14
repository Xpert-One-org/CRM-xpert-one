import React from 'react';

type Props = {} & React.SVGProps<SVGSVGElement>

export default function FlagUk({
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
      viewBox="0 0 26 20"
      fill="none"
      className={className}
    >
      <g opacity="0.5" clipPath="url(#clip0_482_3969)">
        <path d="M0 0H26V20H0V0Z" fill="#012169" />
        <path
          d="M3.04688 0L12.9594 7.54167L22.8312 0H26V2.58333L16.25 10.0417L26 17.4583V20H22.75L13 12.5417L3.29062 20H0V17.5L9.70937 10.0833L0 2.66667V0H3.04688Z"
          fill="white"
        />
        <path
          d="M17.225 11.7083L26 18.3333V20L14.9906 11.7083H17.225ZM9.75 12.5417L9.99375 14L2.19375 20H0L9.75 12.5417ZM26 0V0.125L15.8844 7.95833L15.9656 6.125L23.9688 0H26ZM0 0L9.70937 7.33333H7.27187L0 1.75V0Z"
          fill="#C8102E"
        />
        <path
          d="M9.79062 0V20H16.2906V0H9.79062ZM0 6.66667V13.3333H26V6.66667H0Z"
          fill="white"
        />
        <path
          d="M0 8.04167V12.0417H26V8.04167H0ZM11.0906 0V20H14.9906V0H11.0906Z"
          fill="#C8102E"
        />
      </g>
      <defs>
        <clipPath id="clip0_482_3969">
          <rect width="26" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
