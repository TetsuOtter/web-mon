export interface DeviceStateBoxProps
{
  stroke: string,
  fill?: string,
  text?: string,
  textColor?: string,
  x?: string | number,
  y?: string | number,
}

export const DeviceStateBox = (props: DeviceStateBoxProps) =>
{
  return (
    <svg x={props.x} y={props.y}>
      <rect
        height="20"
        width="40.2"
        x="-0.1"
        fill={props.stroke}
      />
      <rect
        height="18"
        width="38"
        x="1"
        y="1"
        fill={props.fill ?? "black"}
      />

      <text x="20" y="16" textAnchor="middle" fill={props.textColor ?? "white"} fontSize="16px">{props.text ?? ""}</text>
    </svg>
  );
}