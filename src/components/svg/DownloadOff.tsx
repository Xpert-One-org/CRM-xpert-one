import React from 'react';

type Props = {} & React.SVGProps<SVGSVGElement>;

export default function DownloadOff({
  fill = 'white',
  width = 32,
  height = 32,
  className,
}: Props) {
  return (
    <svg
      fill={'none'}
      width={width}
      height={height}
      className={className}
      viewBox="0 0 24 24"
    >
      <g>
        <path
          fill={fill}
          d="M19.775 22.625L17.15 20H6C5.45 20 4.97917 19.8042 4.5875 19.4125C4.19583 19.0208 4 18.55 4 18V15H6V18H15.15L12.575 15.425L12 16L7 11L7.575 10.425L1.375 4.22499L2.8 2.79999L21.2 21.2L19.775 22.625ZM15.425 12.575L14 11.15L15.6 9.54999L17 11L15.425 12.575ZM13 10.15L11 8.14999V3.99999H13V10.15ZM20 17.15L18 15.15V15H20V17.15Z"
          strokeWidth="1"
        ></path>
      </g>
    </svg>
  );
}
