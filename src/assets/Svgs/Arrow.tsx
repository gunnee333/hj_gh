export default function Svg({
  fill = '#d6ded1',
  width = 24,
  rotate = 0
}: { fill?: string; width?: number; rotate?: number } = {}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke={fill}
      width={width}
      height={width}
      style={{
        transform: `rotate(${rotate}deg)`,
        transformOrigin: 'center'
      }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M5 15l7-7 7 7"
      ></path>
    </svg>
  );
}
