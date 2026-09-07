export default function Svg({
  width = 14,
  stroke = '#000000'
}: { width?: number; stroke?: string } = {}) {
  return (
    <svg
      width={width}
      height={width}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_1545_11976)">
        <path
          d="M12.5 0.5H1.5C0.947715 0.5 0.5 0.947715 0.5 1.5V12.5C0.5 13.0523 0.947715 13.5 1.5 13.5H12.5C13.0523 13.5 13.5 13.0523 13.5 12.5V1.5C13.5 0.947715 13.0523 0.5 12.5 0.5Z"
          stroke={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M0.5 3.5H13.5"
          stroke={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 9L6 10.5L9.5 6.5"
          stroke={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_1545_11976">
          <rect width="14" height="14" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
