import React from 'react';

type Props = {} & React.SVGProps<SVGSVGElement>

export default function Plus({
  fill = 'white',
  width = 14,
  height = 14,
  className,
}: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 14 14"
      fill="none"
      className={className}
    >
      <path
        d="M8.54933 0V5.6H14V8.43733H8.54933V14H5.41333V8.43733H0V5.6H5.41333V0H8.54933Z"
        fill={fill}
      />
    </svg>
  );
}
