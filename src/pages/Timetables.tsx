import MaterialTable from 'material-table';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DBCtrler } from '../firestore/DBCtrler';
import { TTimetableDocument } from '../firestore/DBCtrler.types';
import { firestore } from '../firestore/firebaseApp';
import { SHOW_TIMETABLE_PAGE_URL, WEST_MON_PAGE_ID } from "../index";

interface TimetableDataTableStruct extends TTimetableDocument
{
  /** 時刻表ID */
  timetable_id: string,
}

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
  const params = useParams<"line_id">();
  const db = new DBCtrler(firestore, true);

  useEffect(() => {
    if (params.line_id !== undefined)
      db.getAllTimetableDocs(params.line_id).then(result => setTimetableData(result.docs.map(v => toTimetableDataTableStruct(v.id, v.data()))));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (<MaterialTable
    columns={[
      { title: "進行方向", field: "direction" },
      { title: "列車番号", field: "train_id" },
      { title: "種別", field: "train_type" },
      { title: "乗務開始駅", field: "dep_from_name" },
      { title: "乗務開始時刻", field: "dep_from_time", type: "time" },
      { title: "乗務終了駅", field: "work_to_name" },
      { title: "乗務終了時刻", field: "work_to_time", type: "time" },
      { title: "(内部ID)", field: "timetable_id" },
    ]}
    actions={[
      {
        icon: "open_in_browser",
        tooltip: "開く",
        onClick: (_, data) => {
          const d = Array.isArray(data) ? data[0] : data;
          if (params.line_id !== undefined)
            navigate(`${SHOW_TIMETABLE_PAGE_URL}/${params.line_id}/${d.timetable_id}/${WEST_MON_PAGE_ID}`);
        }
      },
      {
        icon: "refresh",
        tooltip: "更新",
        onClick: (_, data) => {
          const d = Array.isArray(data) ? data[0] : data;

          if (params.line_id === undefined)
            return;

          db.getTimetableDoc(params.line_id, d.timetable_id).then(result => {
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
      },
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
