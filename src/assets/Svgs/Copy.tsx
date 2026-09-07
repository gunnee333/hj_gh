export default function Svg({ width = 24, fill = "#4f4f4f" }: { width?: number; fill?: string } = {}) {
  return (
    <svg width={width} height={width} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M7.89941 15.5365H14.8427V17.0365H7.89941V15.5365Z" fill={fill} />
      <path fillRule="evenodd" clipRule="evenodd" d="M7.89844 11.754H12.7813V13.254H7.89844V11.754Z" fill={fill} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.5752 2H14.8875L20.4245 7.76648V22H3.5752V2ZM5.0752 3.5V20.5H18.9245V8.37004L14.2483 3.5H5.0752Z"
        fill={fill}
      />
      <path fillRule="evenodd" clipRule="evenodd" d="M14.8418 2.55469V7.90011H19.9489V9.40011H13.3418V2.55469H14.8418Z" fill={fill} />
    </svg>
  );
}
