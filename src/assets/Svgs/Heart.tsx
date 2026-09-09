export default function Svg({
  width = 14,
  fill = '#eee7e1',
  stroke = '#d4c9bf'
}: { width?: number; fill?: string; stroke?: string } = {}) {
  return (
    <svg
      width={width}
      height={(width / 14) * 12}
      viewBox="0 0 14 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.00003 11.3552L1.48003 6.35517C-1.51997 3.35517 2.89003 -2.40483 7.00003 2.25517C11.11 -2.40483 15.5 3.37517 12.52 6.35517L7.00003 11.3552Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={0.5}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
