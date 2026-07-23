export interface RouteGateMarkProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  gateColor?: string;
  routeColor?: string;
}

export function RouteGateMark({
  className,
  width = "1em",
  height = "1em",
  gateColor = "currentColor",
  routeColor = "currentColor",
}: RouteGateMarkProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      focusable="false"
      height={height}
      viewBox="0 0 53 47"
      width={width}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.5 41V18.5C13.5 10.5 20 4 28 4s14.5 6.5 14.5 14.5V41"
        fill="none"
        stroke={gateColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3.2"
      />
      <path
        d="M4 43c8.5-1.1 11.7-7.7 15.2-13 3.3-5 8.8-3.8 12-8.6 3.1-4.5 1.4-9.2 6.5-13.1C40.6 6.1 44 4.7 49 4"
        fill="none"
        stroke={routeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.6"
      />
      <circle cx="4" cy="43" fill={routeColor} r="2.25" />
      <circle cx="49" cy="4" fill={routeColor} r="2.25" />
    </svg>
  );
}
