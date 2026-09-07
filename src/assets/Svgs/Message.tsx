export default function Svg({ width = 24, fill = "black" }: { width?: number; fill?: string } = {}) {
  return (
    <svg width={width} height={width} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.16633 7.79602L12.0395 12.5686L17.9128 7.79602L18.8587 8.96013L12.0395 14.5014L5.22037 8.96013L6.16633 7.79602Z"
        fill={fill}
      />
      <path fillRule="evenodd" clipRule="evenodd" d="M1.25 2.25H22.75V21.75H1.25V2.25ZM2.75 3.75V20.25H21.25V3.75H2.75Z" fill={fill} />
    </svg>
  );
}
