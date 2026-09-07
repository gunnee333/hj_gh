export default function Svg({ fill = "#ffffff" }: { fill?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" width="32" height="32">
      <use xlinkHref="#pswp__icn-close"></use>
      <path d="M24 10l-2-2-6 6-6-6-2 2 6 6-6 6 2 2 6-6 6 6 2-2-6-6z" id="pswp__icn-close" fill={fill}></path>
    </svg>
  );
}
