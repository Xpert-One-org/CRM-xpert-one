import React from 'react';

type Props = {} & React.SVGProps<SVGSVGElement>

export default function WaterSvg({ className, fill = 'black' }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="11"
      height="15"
      viewBox="0 0 11 15"
      fill="none"
      className={className}
    >
      <path
        d="M5.30553 11.916C4.98223 11.916 4.66794 11.8094 4.41141 11.6126C4.15489 11.4158 3.97045 11.1399 3.88672 10.8276"
        stroke={fill}
        strokeWidth="0.9375"
        strokeLinecap="round"
      />
      <path
        d="M4.14788 2.13344C4.61127 1.34545 4.84333 0.951093 5.17453 0.892343C5.26098 0.876706 5.34953 0.876706 5.43597 0.892343C5.76717 0.951093 5.99924 1.34545 6.46263 2.13344L7.68756 4.21612C8.54367 5.67169 9.21166 7.22999 9.67552 8.8537C10.4297 11.4923 8.44911 14.1192 5.70402 14.1192H4.90649C2.16213 14.1192 0.180783 11.4923 0.934986 8.8537C1.39885 7.22999 2.06683 5.67169 2.92294 4.21612L4.14788 2.13344Z"
        stroke={fill}
        strokeWidth="0.9375"
      />
    </svg>
  );
}
