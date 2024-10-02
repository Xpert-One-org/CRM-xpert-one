import React from 'react';

type Props = {} & React.SVGProps<SVGSVGElement>

export default function Bell({
  fill,
  width = 21,
  height = 21,
  className,
}: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 21 21"
      fill="none"
      className={className}
    >
      <path
        d="M17.5413 14.4133C16.4881 13.1242 15.7444 12.4679 15.7444 8.91392C15.7444 5.65933 14.0825 4.49981 12.7146 3.93667C12.5329 3.86202 12.3619 3.69058 12.3065 3.50395C12.0666 2.68733 11.3939 1.96792 10.4998 1.96792C9.60564 1.96792 8.93257 2.68774 8.69509 3.50477C8.63972 3.69345 8.46868 3.86202 8.28698 3.93667C6.91747 4.50063 5.25716 5.65605 5.25716 8.91392C5.25511 12.4679 4.51149 13.1242 3.45821 14.4133C3.02181 14.9473 3.40407 15.7492 4.16737 15.7492H16.8363C17.5955 15.7492 17.9753 14.9449 17.5413 14.4133Z"
        stroke="#222222"
        strokeWidth="1.00189"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.1255 15.7492V16.4055C13.1255 17.1018 12.8489 17.7696 12.3565 18.2619C11.8642 18.7543 11.1964 19.0309 10.5001 19.0309C9.80384 19.0309 9.13606 18.7543 8.64371 18.2619C8.15136 17.7696 7.87476 17.1018 7.87476 16.4055V15.7492"
        stroke="#222222"
        strokeWidth="1.00189"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
