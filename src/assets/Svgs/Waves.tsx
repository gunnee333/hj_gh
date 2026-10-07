export default function Svg() {
  return (
    <svg
      style={{ zIndex: 2 }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 24 150 28"
      preserveAspectRatio="none"
      shapeRendering="auto"
    >
      <defs>
        <path
          id="gentle-wave"
          d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
        ></path>
      </defs>
      <g>
        <use xlinkHref="#gentle-wave" x="48" y="0" fill="#f8f6f270"></use>
        <use xlinkHref="#gentle-wave" x="48" y="3" fill="#f8f6f250"></use>
        <use xlinkHref="#gentle-wave" x="48" y="5" fill="#f8f6f230"></use>
        <use xlinkHref="#gentle-wave" x="48" y="7" fill="#f8f6f2"></use>
      </g>
    </svg>
  );
}
