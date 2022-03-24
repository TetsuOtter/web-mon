import { MouseEventHandler } from "react";

interface BottomButtonProps
{
  x?: string,
  isSelected?: boolean,
  text?: string,
  onClick?: MouseEventHandler<SVGSVGElement>,
  visibility?: "hidden" | "visible" | "collapse",
}

export const BottomButton = (props: BottomButtonProps) => {
  const diff_y = 3;
  const diff_x = (5 * diff_y) / 23;

  return (
    <svg x={props.x ?? "0"} y={`${570 - diff_y}px`} width="80px" height={`${30 + diff_y}px`} onClick={props.onClick} visibility={props.visibility}>
      <path d={`M -1,${diff_y} l 82,0 -5,24 -10,6 -52,0 -10,-6 -5,-24 z`} fill="white" />
      {
        props.isSelected === true
          ? (<path d={`M 1,0 m -${diff_x},0 l ${diff_x},0 78,0 ${diff_x},0 -${diff_x},${diff_y} -5,23 -9,5 -50,0 -9,-5 -5,-23 z`} fill="black" />)
          : (<path d={`M 1,${diff_y} l 78,0 -5,23 -9,5 -50,0 -9,-5 -5,-23 z`} fill="blue" />)
      }
      <text x="50%" y="23px" fill="white" fontSize="16px" textAnchor="middle">{props.text ?? ""}</text>
    </svg>
  );
}