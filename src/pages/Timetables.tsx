import MaterialTable, { Action, Column } from 'material-table';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TTimetableDocument } from '../firestore/DBCtrler.types';
import { generateParams, getIDParams, SHOW_TIMETABLE_PAGE_URL } from "../index";
import { State } from '../redux/reducer';
import { useSelector } from 'react-redux';

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

const reduxSelector = (state: State) => {
  return {
    db: state.setCurrentUserReducer.dbCtrler,
    uid: state.setCurrentUserReducer.currentUser?.uid,
  };
};

export const Timetables = () => {
  const [timetableData, setTimetableData] = useState<TimetableDataTableStruct[]>([]);
  const navigate = useNavigate();
  const params = getIDParams(useLocation());
  const { db, uid } = useSelector(reduxSelector);

  useEffect(() => {
    if (params["line-id"] === undefined || db === undefined)
      return;
    const line_id = params["line-id"];
    db.getAllTimetableDocs(line_id)
      .then(async (result) => {
        if (result.empty)
          result = await db.getAllTimetableDocs(line_id, true);

        setTimetableData(result.docs.map(v => toTimetableDataTableStruct(v.id, v.data())));
      });
  }, [db]);

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

      if (params["line-id"] === undefined || db === undefined)
        return;

      db.getTimetableDoc(params["line-id"], d.timetable_id, true).then(result => {
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

  const getIsEditable = (data: TimetableDataTableStruct): boolean => {
    return !!uid;
  };

  const onRowAdd = (data: TimetableDataTableStruct): Promise<unknown> => {
    return Promise.resolve();
  };

  /* TODO: 列車の削除はサーバーサイドで行う処理であるため、そちらを実装し次第こちらにも実装する
  const onRowDelete = (data: TimetableDataTableStruct): Promise<unknown> => {
    return Promise.resolve();
  };
  */

  const onRowUpdate = (data: TimetableDataTableStruct): Promise<unknown> => {
    return Promise.resolve();
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
    editable={{
      isEditable: getIsEditable,
      isDeletable: getIsEditable,

      onRowAdd: uid ? onRowAdd : undefined,
      // onRowDelete: onRowDelete,
      onRowUpdate: uid ? onRowUpdate : undefined,
    }}
  >

  </MaterialTable>);
}
