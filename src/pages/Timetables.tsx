import MaterialTable, { Action, Column } from 'material-table';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DBCtrler } from '../firestore/DBCtrler';
import { TTimetableDocument } from '../firestore/DBCtrler.types';
import { firestore } from '../firestore/firebaseApp';
import { generateParams, getIDParams, SHOW_TIMETABLE_PAGE_URL } from "../index";

interface TimetableDataTableStruct extends TTimetableDocument
{
  /** 時刻表ID */
  timetable_id: string,
}

const COLUMNS: Column<TimetableDataTableStruct>[] = [
  { title: "進行方向", field: "direction" },
  { title: "列車番号", field: "train_id" },
  { title: "種別", field: "train_type" },
  { title: "乗務開始駅", field: "dep_from_name" },
  { title: "乗務開始時刻", field: "dep_from_time", type: "time" },
  { title: "乗務終了駅", field: "work_to_name" },
  { title: "乗務終了時刻", field: "work_to_time", type: "time" },
  { title: "(内部ID)", field: "timetable_id", editable: "never" },
];

function toTimetableDataTableStruct(id: string, d: TTimetableDocument): TimetableDataTableStruct
{
  return {
    ...d,
    timetable_id: id
  };
}

export const Timetables = () => {
  const [timetableData, setTimetableData] = useState<TimetableDataTableStruct[]>([]);
  const navigate = useNavigate();
  const params = getIDParams(useLocation());
  const db = new DBCtrler(firestore, true);

  useEffect(() => {
    if (params["line-id"] !== undefined)
      db.getAllTimetableDocs(params["line-id"]).then(result => setTimetableData(result.docs.map(v => toTimetableDataTableStruct(v.id, v.data()))));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const OPEN_THIS_TRAIN: Action<TimetableDataTableStruct> = {
    icon: "open_in_browser",
    tooltip: "開く",
    onClick: (_, data) => {
      const d = Array.isArray(data) ? data[0] : data;
      if (params["line-id"] !== undefined)
        navigate(`${SHOW_TIMETABLE_PAGE_URL}${generateParams({ "line-id": params["line-id"], "timetable-id": d.timetable_id })}`);
    }
  };

  const RELOAD_THIS_TRAIN: Action<TimetableDataTableStruct> = {
    icon: "refresh",
    tooltip: "更新",
    onClick: (_, data) => {
      const d = Array.isArray(data) ? data[0] : data;

      if (params["line-id"] === undefined)
        return;

      db.getTimetableDoc(params["line-id"], d.timetable_id).then(result => {
        const index = timetableData.findIndex(v => v.timetable_id === d.timetable_id);
        const orig = Array.from(timetableData);
        const data = result.data();
        if (data !== undefined)
        {
          orig[index] = toTimetableDataTableStruct(result.id, data);
          setTimetableData(orig);
        }
      });
    }
  };

  return (<MaterialTable
    columns={COLUMNS}
    actions={[
      OPEN_THIS_TRAIN,
      RELOAD_THIS_TRAIN,
    ]}
    data={timetableData}
    title="時刻表一覧"
    options={{
      headerStyle: {
        whiteSpace: "nowrap"
      }
    }}
  >

  </MaterialTable>);
}
