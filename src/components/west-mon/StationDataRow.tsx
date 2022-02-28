import { TStationDocument } from "../../firestore/DBCtrler.types";

interface StationDataRowProps
{
  y: number,
  color?: string,
  stationData?: TStationDocument,
  showRunTime?: boolean,
}

export const StationDataRow = (props: StationDataRowProps) => {
  const required_time_to_this_sta = props.stationData?.required_time_to_this_sta ?? 0;
  const required_time_to_this_sta_minute = required_time_to_this_sta >= 60 ? (required_time_to_this_sta / 60).toFixed(0) : undefined;
  const required_time_to_this_sta_second = required_time_to_this_sta >= 1 ? (required_time_to_this_sta % 60).toFixed(0) : undefined;

  const color = props.color ?? "white";

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
        <text y="50" x="35" width="32" textAnchor="end" fill={color} fontSize="16px" >{props.stationData?.arrive_time_hh}</text>
        <text y="50" x="35" width="16" fill={color} fontSize="16px" >{props.stationData?.arr_symbol}</text>
        <text y="50" x="50" width="32" fill={color} fontSize="16px" >{props.stationData?.arrive_time_mm}</text>
        <text y="50" x="85" width="16" fill={color} fontSize="16px" >{(props.stationData?.arrive_time_ss ?? "") === "" ? "" : "."}</text>
        <text y="50" x="100" width="16" fill={color} fontSize="16px" >{props.stationData?.arrive_time_ss}</text>
      </svg>
      <svg x="430" width="126">
        <text y="50" x="36" width="32" textAnchor="end" fill={color} fontSize="16px" >{props.stationData?.departure_time_hh}</text>
        <text y="50" x="36" width="16" fill={color} fontSize="16px" >{props.stationData?.dep_symbol}</text>
        <text y="50" x="52" width="32" fill={color} fontSize="16px" >{props.stationData?.departure_time_mm}</text>
        <text y="50" x="84" width="16" fill={color} fontSize="16px" >{(props.stationData?.departure_time_ss ?? "") === "" ? "" : "."}</text>
        <text y="50" x="100" width="16" fill={color} fontSize="16px" >{props.stationData?.departure_time_ss}</text>
      </svg>

      <text y="50" x="625" textAnchor="middle" width="54" fill={color} fontSize="16px" >{props.stationData?.run_in_limit}</text>
      <text y="50" x="675" textAnchor="middle" width="54" fill={color} fontSize="16px" >{props.stationData?.run_out_limit}</text>
    </svg>
  );
}
