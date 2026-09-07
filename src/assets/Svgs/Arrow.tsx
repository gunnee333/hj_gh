export default function Svg({ fill = "#d6ded1" }: { fill?: string } = {}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke={fill}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 15l7-7 7 7"></path>
    </svg>
  );
}
