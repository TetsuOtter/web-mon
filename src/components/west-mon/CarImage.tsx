import moji from "moji";

export interface CarImageProps
{
  isDriversCar?: boolean,
  isLeftSideHEAD?: boolean,
  isRightSideHEAD?: boolean,
  isLeftPanAvailable?: boolean,
  isRightPanAvailable?: boolean,
  isLeftPanUp?: boolean,
  isRightPanUp?: boolean,
  carNumber?: number | string,
  carDescriptionChars?: string,
  width?: number,
  fill?: string,
  text?: string,
  textColor?: string,
  isLeftBogieLeftWheelMotored?: boolean,
  isLeftBogieRightWheelMotored?: boolean,
  isRightBogieLeftWheelMotored?: boolean,
  isRightBogieRightWheelMotored?: boolean,
  x: number | string,
  y: number | string,
}

function getCarNumberStr(num: number | string | undefined) : string
{
  if (num === undefined)
    return "";

  // 文字列で渡されたらそのまま返す
  if (typeof num === "string")
    return num;

  // 負の号車番号は表示しない
  if (num < 0)
    return "";

  // 数値を文字列にする
  const numStr = num.toString();

  // 1桁は全角として表示する
  // 2桁以上は半角として表示する
  if (numStr.length === 1)
    return moji(numStr).convert("HE", "ZE").toString();
  else
    return numStr;
}

export const CarImage = (props: CarImageProps) => {
  const HEAD_WIDTH = 15;
  const needed_width =
    (props.isLeftSideHEAD ? (HEAD_WIDTH + 1) : 0)
    + (props.isRightSideHEAD ? (HEAD_WIDTH + 1) : 0)
    + (props.isLeftPanAvailable ? 12 : 0)
    + (props.isRightPanAvailable ? 12 : 0);
  const width = Math.max(40, props.width !== undefined && props.width >= needed_width ? props.width : needed_width);
  const overWidth = 0.25;

  const panRec_HnW = (11 / 2) * Math.SQRT2;
  const panInnerRec_HnW = (9 / 2) * Math.SQRT2;

  return (
    <svg width={width} x={props.x} y={props.y}>
      <path d={`M -${overWidth},12
        L ${props.isLeftSideHEAD ? `${HEAD_WIDTH},4` : ""} ${HEAD_WIDTH},12
        ${width - HEAD_WIDTH},12 ${props.isRightSideHEAD ? `${width - HEAD_WIDTH},4` : ""}
        ${width + overWidth},12 ${width + overWidth},24 -${overWidth},24 -${overWidth},12`}
        fill="white" />
      <path d={`M 1,13
        L ${props.isLeftSideHEAD ? `1,12.5 ${HEAD_WIDTH - 1},5.5` : ""} ${HEAD_WIDTH - 1},13
        ${width - HEAD_WIDTH + 1},13 ${props.isRightSideHEAD ? `${width - HEAD_WIDTH + 1},5.5 ${width - 1},12.5` : ""}
        ${width - 1},13 ${width - 1},23 1,23 1,12`}
        fill={props.isDriversCar ? "blue" : "black"} />

      <rect x={-overWidth} y="23" height="21" width={width + (overWidth * 2)} fill="white"/>
      <rect x="1" y="25" height="18" width={width - 2} fill={props.fill ?? "black"} />

      <svg
        x={(props.isLeftSideHEAD ? HEAD_WIDTH : 0) + 1}
        y="1"
        visibility={props.isLeftPanAvailable ? "visible" : "hidden"}>
        <rect
          x="3"
          height={panRec_HnW}
          width={panRec_HnW}
          transform={`rotate(45 ${panRec_HnW / 2} ${panRec_HnW / 2})`}
          fill="white"
        />
        <rect
          x="4"
          height={panInnerRec_HnW}
          width={panInnerRec_HnW}
          transform={`rotate(45 ${panInnerRec_HnW / 2} ${panInnerRec_HnW / 2})`}
          fill={props.isLeftPanUp ? "white" : "black"}
        />
      </svg>
      <svg
        x={width - (props.isRightSideHEAD ? HEAD_WIDTH : 0) - 12}
        y="1"
        visibility={props.isRightPanAvailable ? "visible" : "hidden"}>
        <rect
          x="3"
          height={panRec_HnW}
          width={panRec_HnW}
          transform={`rotate(45 ${panRec_HnW / 2} ${panRec_HnW / 2})`}
          fill="white"
        />
        <rect
          x="4"
          height={panInnerRec_HnW}
          width={panInnerRec_HnW}
          transform={`rotate(45 ${panInnerRec_HnW / 2} ${panInnerRec_HnW / 2})`}
          fill={props.isRightPanUp ? "white" : "black"}
        />
      </svg>

      <ellipse
        cx="5.5"
        cy="48.49"
        rx="4.5"
        ry="4.52"
        fill="white"
        visibility={props.isLeftBogieLeftWheelMotored ? "visible" : "hidden"}
      />
      <ellipse
        cx="14.5"
        cy="48.49"
        rx="4.5"
        ry="4.52"
        fill="white"
        visibility={props.isLeftBogieRightWheelMotored ? "visible" : "hidden"}
      />
      <ellipse
        cx={width - 14.5}
        cy="48.49"
        rx="4.5"
        ry="4.52"
        fill="white"
        visibility={props.isRightBogieLeftWheelMotored ? "visible" : "hidden"}
      />
      <ellipse
        cx={width - 5.5}
        cy="48.49"
        rx="4.5"
        ry="4.52"
        fill="white"
        visibility={props.isRightBogieRightWheelMotored ? "visible" : "hidden"}
      />

      <text
        x={width / 2}
        y="23"
        textAnchor="middle"
        fontSize="12px"
        fill="white"
        fontFamily="JF-Dot-Shinonome12"
      >{props.carDescriptionChars}</text>
      <text x={width / 2} y="44" textAnchor="middle" fontSize="16px" fill={props.textColor}>{props.text}</text>
      <text x={width / 2} y="72" textAnchor="middle" fontSize="16px" fill="white">{getCarNumberStr(props.carNumber)}</text>
    </svg>
  );
}