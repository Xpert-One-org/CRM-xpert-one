import React from 'react';

type Props = {} & React.SVGProps<SVGSVGElement>

export default function ArrowSelect({
  fill,
  width = 28,
  height = 28,
  className,
}: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 28 28"
      fill="none"
      className={className}
    >
      <rect width="28" height="28" rx="3" fill="#F8F8F8" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.7071 11.2929C19.0676 11.6534 19.0953 12.2206 18.7903 12.6129L18.7071 12.7071L14.7071 16.7071C14.3466 17.0676 13.7794 17.0953 13.3871 16.7903L13.2929 16.7071L9.29289 12.7071C8.90237 12.3166 8.90237 11.6834 9.29289 11.2929C9.65338 10.9324 10.2206 10.9047 10.6129 11.2097L10.7071 11.2929L14 14.585L17.2929 11.2929C17.6534 10.9324 18.2206 10.9047 18.6129 11.2097L18.7071 11.2929Z"
        fill="#222222"
      />
    </svg>
  );
}
