import MaterialTable, { Action, Column } from 'material-table';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DBCtrler } from '../firestore/DBCtrler';
import { TStationDocument } from '../firestore/DBCtrler.types';
import { firestore } from '../firestore/firebaseApp';
import { generateParams, getIDParams, WEST_MON_PAGE_ID } from "../index";

interface StationDataWithID extends TStationDocument
{
  /** 駅情報ID */
  station_id: string,
}

const COLUMNS: Column<StationDataWithID>[] = [
  { title: "駅位置", field: "location", type: "numeric" },
  { title: "駅名", field: "full_name" },
  { title: "4文字\n駅名", field: "name_len_4" },
  { title: "前駅からの\n所要時間\n[秒]", field: "required_time_to_this_sta", type: "numeric" },
  { title: "到着時刻", field: "arrive_time", type: "time" },
  { title: "到着時刻表示部に\n表示する文字", field: "arr_symbol" },
  { title: "発車時刻", field: "departure_time", type: "time" },
  { title: "発車時刻表示部に\n表示する文字", field: "arr_symbol" },
  { title: "通過駅TF", field: "is_pass", type: "boolean" },
  { title: "着発\n番線", field: "track_num" },
  { title: "進入\n制限\n[km/h]", field: "run_in_limit", type: "numeric" },
  { title: "進出\n制限\n[km/h]", field: "run_out_limit", type: "numeric" },
  { title: "駅仕業", field: "sta_work" },
  { title: "表示色", field: "sta_color" },
  { title: "(内部ID)", field: "station_id" },
];

export const ShowTimetable = () => {
  // const [timetableData, setTimetableData] = useState<TTimetableDocument>();
  const [stationsData, setStationsData] = useState<StationDataWithID[]>([]);
  const navigate = useNavigate();
  const params = getIDParams(useLocation());
  const db = new DBCtrler(firestore, true);

  useEffect(() => {
    if (params["line-id"] !== undefined && params["timetable-id"] !== undefined)
    {
      /*db.getTimetableDoc(params["line-id"], params["timetable-id"])
        .then(v => setTimetableData(v.data()));*/
      db.get1to9StationDocs(params["line-id"], params["timetable-id"])
        .then(v => setStationsData(v.docs.map(d => ({ ...d.data(), station_id: d.id }))));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const START_FROM_THIS_STATION_IN_WESTMON: Action<StationDataWithID> = {
    icon: "open_in_browser",
    tooltip: "開く",
    onClick: (_, data) => {
      const d = Array.isArray(data) ? data[0] : data;
      if (params["line-id"] !== undefined)
        navigate(`/${WEST_MON_PAGE_ID}${generateParams({ "line-id": params["line-id"], "timetable-id": params["timetable-id"], "station-id": d.station_id })}`);
    }
  };

  const RELOAD_THIS_STATION: Action<StationDataWithID> = {
    icon: "refresh",
    tooltip: "更新",
    onClick: (_, data) => {
      const d = Array.isArray(data) ? data[0] : data;

      if (params["line-id"] === undefined || params["timetable-id"] === undefined)
        return;

      db.getStationDoc(params["line-id"], params["timetable-id"], d.station_id).then(result => {
        const index = stationsData.findIndex(v => v.station_id === d.station_id);
        const orig = Array.from(stationsData);
        const data = result.data();
        if (data !== undefined)
        {
          orig[index] = {...data, station_id: result.id};
          setStationsData(orig);
        }
      });
    }
  }

  return (<MaterialTable
    columns={COLUMNS}
    actions={[
      START_FROM_THIS_STATION_IN_WESTMON,
      RELOAD_THIS_STATION,
    ]}
    data={stationsData}
    title="駅一覧"
    options={{
      headerStyle: {
        whiteSpace: "nowrap"
      }
    }}
  >

  </MaterialTable>);
}
