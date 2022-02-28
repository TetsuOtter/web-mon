import { StationDataRow } from "./StationDataRow";
import { TStationDocument } from "../../firestore/DBCtrler.types";

export interface TimetableProps
{
  stations?: TStationDocument[],
  currentLocation?: number,
  x?: number,
  y?: number,
}

export const Timetable = (props: TimetableProps) => {
  const staD: TStationDocument = {
    arr_symbol: "：",
    arrive_time_hh: "２３",
    arrive_time_mm: "５９",
    arrive_time_ss: "59",
    dep_symbol: "===",
    departure_time_hh: "",
    departure_time_mm: "",
    departure_time_ss: "",
    full_name: "フル尺駅名",
    is_pass: false,
    location: 1,
    name_len_4: "短縮駅名",
    required_time_to_this_sta: 99,
    run_in_limit: 20,
    run_out_limit: 95,
    sta_color: "lime",
    sta_work: "",
    track_num: "２",
  }

  const x = props.x ?? 50;
  const y = props.y ?? 208;
  const height = 16 * 17; // = 272
  const width = 700;

  return (
    <svg>
      <rect x={x} y={y} height={height} width={width} stroke="white" strokeWidth="1px" />
      <svg x={x} y={y}>
        <rect x="0" height="36" width={width} stroke="white" strokeWidth="1px" fill="blue" />

        <rect x="0" width="75" height={height} stroke="white" strokeWidth="1px" fill="none" />
        <text y="18" x={75 / 2} textAnchor="middle" dominantBaseline="central" fill="white" fontSize="16px">時分</text>

        <rect x="75" width="180" height={height} stroke="white" strokeWidth="1px" fill="none" />
        <text y="18" x={75 + 180 / 2} textAnchor="middle" dominantBaseline="central" fill="white" fontSize="16px">停車場名</text>

        <rect x="255" width="55" height={height} stroke="white" strokeWidth="1px" fill="none" />
        <text y="18" x={255 + 55 / 2} textAnchor="middle" dominantBaseline="central" fill="white" fontSize="16px">着発線</text>

        <rect x="310" width="120" height={height} stroke="white" strokeWidth="1px" fill="none" />
        <text y="18" x={310 + 120 / 2} textAnchor="middle" dominantBaseline="central" fill="white" fontSize="16px">着時刻</text>

        <rect x="430" width="120" height={height} stroke="white" strokeWidth="1px" fill="none" />
        <text y="18" x={430 + 120 / 2} textAnchor="middle" dominantBaseline="central" fill="white" fontSize="16px">発時刻</text>

        <rect x="550" width="50" height={height} stroke="white" strokeWidth="1px" fill="none" />
        <text y="18" x={550 + 50 / 2} textAnchor="middle" dominantBaseline="central" fill="white" fontSize="16px">線路</text>

        <rect x="600" width="100" height={height} stroke="white" strokeWidth="1px" fill="none" />
        <text y="9" x={600 + 100 / 2} textAnchor="middle" dominantBaseline="central" fill="white" fontSize="16px">制限速度</text>

        <rect x="600" width="50" y="18" height="254" stroke="white" strokeWidth="1px" fill="none" />
        <text y="27" x={600 + 50 / 2} textAnchor="middle" dominantBaseline="central" fill="white" fontSize="16px">進入</text>

        <rect x="650" width="50" y="18" height="254" stroke="white" strokeWidth="1px" fill="none" />
        <text y="27" x={650 + 50 / 2} textAnchor="middle" dominantBaseline="central" fill="white" fontSize="16px">進出</text>

        <StationDataRow y={16} stationData={staD} showRunTime={false} />
        <StationDataRow y={46} stationData={staD} />
        <StationDataRow y={76} stationData={staD} />
        <StationDataRow y={106} stationData={staD} />
        <StationDataRow y={136} stationData={staD} />

        <text x="36" y={232} textAnchor="middle" fill="aqua" fontSize="16px">次採時駅</text>
        <StationDataRow y={182} stationData={staD} color="aqua" showRunTime={false} />

        <text x="36" y={262} textAnchor="middle" fill="yellow" fontSize="16px">次停車駅</text>
        <StationDataRow y={212} stationData={staD} color="yellow" showRunTime={false} />
      </svg>
    </svg>
  );
};