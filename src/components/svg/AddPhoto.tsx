import React from 'react';

type Props = {} & React.SVGProps<SVGSVGElement>

export default function AddPhoto({
  fill = 'white',
  stroke,
  width = 57,
  height = 52,
  style,
  className,
}: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 57 52"
      fill="none"
      className={className}
    >
      <g filter="url(#filter0_d_1200_8936)">
        <path
          d="M8.3913 8.28571V2H12.6522V8.28571H19.0435V12.4762H12.6522V18.7619H8.3913V12.4762H2V8.28571H8.3913ZM14.7826 20.8571V14.5714H21.1739V8.28571H36.087L39.9857 12.4762H46.7391C49.0826 12.4762 51 14.3619 51 16.6667V41.8095C51 44.1143 49.0826 46 46.7391 46H12.6522C10.3087 46 8.3913 44.1143 8.3913 41.8095V20.8571H14.7826ZM29.6957 39.7143C35.5757 39.7143 40.3478 35.021 40.3478 29.2381C40.3478 23.4552 35.5757 18.7619 29.6957 18.7619C23.8157 18.7619 19.0435 23.4552 19.0435 29.2381C19.0435 35.021 23.8157 39.7143 29.6957 39.7143ZM22.8783 29.2381C22.8783 32.9467 25.9248 35.9429 29.6957 35.9429C33.4665 35.9429 36.513 32.9467 36.513 29.2381C36.513 25.5295 33.4665 22.5333 29.6957 22.5333C25.9248 22.5333 22.8783 25.5295 22.8783 29.2381Z"
          fill={fill}
        />
      </g>
      <defs>
        <filter
          id="filter0_d_1200_8936"
          x="0"
          y="0"
          width="57"
          height="52"
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
            result="effect1_dropShadow_1200_8936"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_1200_8936"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}
