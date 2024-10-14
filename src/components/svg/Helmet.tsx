import React from 'react';

type Props = {} & React.SVGProps<SVGSVGElement>

export default function Helmet({
  fill,
  width = 32,
  height = 32,
  className,
}: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={height}
      width={width}
      className={className}
      viewBox="0 0 32 32"
      fill="none"
    >
      <path
        d="M5.6 20.7273C5.6 23.717 6.69571 26.5842 8.64609 28.6983C10.5965 30.8123 13.2417 32 16 32C18.7583 32 21.4035 30.8123 23.3539 28.6983C25.3043 26.5842 26.4 23.717 26.4 20.7273M14.7 1C13.92 1 13.4 1.59182 13.4 2.40909V10.8636H10.8V3.81818C10.8 3.81818 4.95 6.24182 4.95 14.3864C4.95 14.3864 3 14.7809 3 17.9091H29C28.87 14.7809 27.05 14.3864 27.05 14.3864C27.05 6.24182 21.2 3.81818 21.2 3.81818V10.8636H18.6V2.40909C18.6 1.59182 18.106 1 17.3 1H14.7Z"
        fill={fill}
      />
    </svg>
  );
}
