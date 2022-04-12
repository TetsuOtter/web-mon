import { TStationDocument } from "../../firestore/DBCtrler.types";
import moji from "moji";

interface StationDataRowProps {
  y: number,
  color?: string,
  stationData?: TStationDocument,
  showRunTime?: boolean,
}

export const StationDataRow = (props: StationDataRowProps) => {
  const required_time_to_this_sta = props.stationData?.required_time_to_this_sta ?? 0;
  const required_time_to_this_sta_minute = required_time_to_this_sta >= 60 ? Math.floor(required_time_to_this_sta / 60).toString() : "";
  const required_time_to_this_sta_second = required_time_to_this_sta >= 1 ? Math.floor(required_time_to_this_sta % 60).toString().padStart(2, "0") : "";

  const color = props.color ?? "white";

  const arrTimeHH = moji(props.stationData?.arrive_time.getHours().toString() ?? "").convert("HE", "ZE").toString();
  const arrTimeMM = moji(props.stationData?.arrive_time.getMinutes().toString() ?? "").convert("HE", "ZE").toString();
  const arrTimeSS = moji(props.stationData?.arrive_time.getSeconds().toString() ?? "").convert("ZE", "HE").toString();

  const depTimeHH = moji(props.stationData?.departure_time.getHours().toString() ?? "").convert("HE", "ZE").toString();
  const depTimeMM = moji(props.stationData?.departure_time.getMinutes().toString() ?? "").convert("HE", "ZE").toString();
  const depTimeSS = moji(props.stationData?.departure_time.getSeconds().toString() ?? "").convert("ZE", "HE").toString();

  return (
    <svg x="0" y={props.y} height="54" width="720">
      {/* TODO: 走行時間は駅名の上をBaseLineにして配置する */}
      <svg height="40" width="72" y="1">
        <text y="16" x="45"
          visibility={props.showRunTime === false ? "hidden" : "visible"}
          textAnchor="end" fill={color} fontSize="16px" transform="scale(1,2)">{required_time_to_this_sta_minute}</text>
        <text y="32" x="50"
          visibility={props.showRunTime === false ? "hidden" : "visible"}
          textAnchor="start" fill={color} fontSize="16px" >{required_time_to_this_sta_second}</text>
      </svg>

      <svg x="90">
        <text y="50" fill={color} fontSize="16px" transform="scale(2,1)">{props.stationData?.name_len_4}</text>
      </svg>
      <text y="50" x="255" width="54" fill={color} fontSize="16px" >{props.stationData?.track_num}</text>

      <svg x="310" width="126">
        <text y="50" x="35" width="32" textAnchor="end" fill={color} fontSize="16px" >{arrTimeHH}</text>
        <text y="50" x="35" width="16" fill={color} fontSize="16px" >{props.stationData?.arr_symbol}</text>
        <text y="50" x="50" width="32" fill={color} fontSize="16px" >{arrTimeMM}</text>
        <text y="50" x="85" width="16" fill={color} fontSize="16px" >{(props.stationData?.arrive_time.getSeconds() ?? 0) === 0 ? "" : "."}</text>
        <text y="50" x="100" width="16" fill={color} fontSize="16px" >{arrTimeSS}</text>
      </svg>
      <svg x="430" width="126">
        <text y="50" x="36" width="32" textAnchor="end" fill={color} fontSize="16px" >{depTimeHH}</text>
        <text y="50" x="36" width="16" fill={color} fontSize="16px" >{props.stationData?.dep_symbol}</text>
        <text y="50" x="52" width="32" fill={color} fontSize="16px" >{depTimeMM}</text>
        <text y="50" x="84" width="16" fill={color} fontSize="16px" >{(props.stationData?.departure_time.getSeconds() ?? 0) === 0 ? "" : "."}</text>
        <text y="50" x="100" width="16" fill={color} fontSize="16px" >{depTimeSS}</text>
      </svg>

      <text y="50" x="625" textAnchor="middle" width="54" fill={color} fontSize="16px" >{props.stationData?.run_in_limit}</text>
      <text y="50" x="675" textAnchor="middle" width="54" fill={color} fontSize="16px" >{props.stationData?.run_out_limit}</text>
    </svg>
  );
}
