export default function Svg({
  width = 32,
  fill = '#ffffff'
}: {
  width?: number;
  fill?: string;
}) {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" width={width} height={width}>
      <use xlinkHref="#pswp__icn-close"></use>
      <path
        d="M24 10l-2-2-6 6-6-6-2 2 6 6-6 6 2 2 6-6 6 6 2-2-6-6z"
        id="pswp__icn-close"
        fill={fill}
      ></path>
    </svg>
  );
}
