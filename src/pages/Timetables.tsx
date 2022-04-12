import MaterialTable, { Action, Column } from 'material-table';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TTimetableDocument } from '../firestore/DBCtrler.types';
import { generateParams, getIDParams, SHOW_TIMETABLE_PAGE_URL } from "../index";
import { State } from '../redux/reducer';
import { useDispatch, useSelector } from 'react-redux';
import { setLine, setTrain } from "../redux/setters";

interface TimetableDataTableStruct extends TTimetableDocument {
  /** 時刻表ID */
  timetable_id: string,
}

const COLUMNS: Column<TimetableDataTableStruct>[] = [
  {
    title: "進行方向",
    field: "direction",
    lookup: {
      "Inbound": "Inbound",
      "Outbound": "Outbound"
    },
    initialEditValue: "Inbound",
  },
  {
    title: "列番",
    field: "train_id",
    initialEditValue: "",
    validate: (d) => {
      if (d.train_id.length <= 0 || 128 <= d.train_id.length)
        return {
          isValid: false,
          helperText: "1 Byte以上127 Byte以下"
        }
      else
        return true;
    }
  },
  { title: "P列番", field: "sec_sys_train_id", initialEditValue: "" },
  { title: "通過設定", field: "sec_sys_sta_pass_setting", type: "boolean", initialEditValue: false },
  { title: "無線番号", field: "radio_ch", initialEditValue: "" },
  { title: "線の色", field: "line_color", initialEditValue: "000000" },
  { title: "種別", field: "train_type", initialEditValue: "" },
  { title: "乗務開始駅", field: "dep_from_name", initialEditValue: "" },
  { title: "乗務開始時刻", field: "dep_from_time", type: "time", initialEditValue: new Date(Date.now()) },
  { title: "乗務開始番線", field: "dep_from_track_num", initialEditValue: "" },
  { title: "乗務終了駅", field: "work_to_name", initialEditValue: "" },
  { title: "乗務終了時刻", field: "work_to_time", type: "time", initialEditValue: new Date(Date.now()) },
  { title: "乗務終了番線", field: "work_to_track_num", initialEditValue: "" },
  { title: "列車終着駅", field: "last_stop_name", initialEditValue: "" },
  { title: "列車終着時刻", field: "last_stop_time", type: "time", initialEditValue: new Date(Date.now()) },
  { title: "列車終着番線", field: "last_stop_track_num", initialEditValue: "" },
  { title: "乗務員区所", field: "office_name", initialEditValue: "" },
  { title: "行路番号", field: "work_number", initialEditValue: "" },
  { title: "ダイヤ発効日", field: "effected_date", type: "date", initialEditValue: new Date(new Date(Date.now()).setHours(0, 0, 0, 0)) },
  { title: "付帯情報", field: "additional_info", type: "string", initialEditValue: "" },
  { title: "tags", field: "tags", editable: "never", render: () => (<p>(準備中)</p>), initialEditValue: [] },
  { title: "次列車", field: "next_work", editable: "never", render: () => (<p>(準備中)</p>), initialEditValue: null },
  { title: "(内部ID)", field: "timetable_id", editable: "never" },
];

function toTimetableDataTableStruct(id: string, d: TTimetableDocument): TimetableDataTableStruct {
  return {
    ...d,
    timetable_id: id
  };
}
function fromTimetableDataTableStruct(d: TimetableDataTableStruct): TTimetableDocument {
  const { timetable_id, ...value } = d;
  return value;
}

const reduxSelector = (state: State) => {
  return {
    db: state.setCurrentUserReducer.dbCtrler,
    uid: state.setCurrentUserReducer.currentUser?.uid,
    line_id: state.setSharedDataReducer.lineDataId,
  };
};

export const Timetables = () => {
  const [timetableData, setTimetableData] = useState<TimetableDataTableStruct[]>([]);
  const navigate = useNavigate();
  const params = getIDParams(useLocation());
  const { db, uid, line_id } = useSelector(reduxSelector);
  const dispatch = useDispatch();

  // クエリ文字列で指定されたデータIDをReduxに登録する処理
  useEffect(() => {
    if (!db || !params["line-id"] || params["line-id"] === line_id)
      return;

    db.getLineDoc(params["line-id"]).then(value => {
      if (!value.exists())
        return;

      dispatch(setLine(value.id, value.data()));
    });
  }, [db, params, line_id, dispatch]);

  // 指定された路線のデータを読み込む処理
  useEffect(() => {
    if (db === undefined || !line_id)
      return;

    db.getAllTimetableDocs(line_id)
      .then(async (result) => {
        if (result.empty)
          result = await db.getAllTimetableDocs(line_id, true);

        setTimetableData(result.docs.map(v => toTimetableDataTableStruct(v.id, v.data())));
      });
  }, [db, line_id]);

  const OPEN_THIS_TRAIN: Action<TimetableDataTableStruct> = {
    icon: "open_in_browser",
    tooltip: "開く",
    onClick: (_, data) => {
      const d = Array.isArray(data) ? data[0] : data;

      if (!line_id) {
        dispatch(setTrain(d.timetable_id, fromTimetableDataTableStruct(d)));
        navigate(`${SHOW_TIMETABLE_PAGE_URL}${generateParams({ "line-id": line_id, "timetable-id": d.timetable_id })}`);
      }
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
        if (data !== undefined) {
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
    if (uid === undefined || db === undefined)
      return Promise.reject("サインインして下さい");
    if (!line_id)
      return Promise.reject("路線IDが指定されていません");

    return db.addTimetableDoc(line_id, fromTimetableDataTableStruct(data)).then(v => {
      data.timetable_id = v.id;
      setTimetableData([...timetableData, data]);
    });
  };

  /* TODO: 列車の削除はサーバーサイドで行う処理であるため、そちらを実装し次第こちらにも実装する
  const onRowDelete = (data: TimetableDataTableStruct): Promise<unknown> => {
    return Promise.resolve();
  };
  */

  const onRowUpdate = (data: TimetableDataTableStruct): Promise<unknown> => {
    if (uid === undefined || db === undefined)
      return Promise.reject("サインインして下さい");
    if (!line_id)
      return Promise.reject("路線IDが指定されていません");

    return db.updateTimetableDoc(line_id, data.timetable_id, fromTimetableDataTableStruct(data)).then(() => {
      const orig = Array.from(timetableData);
      const index = orig.findIndex(v => v.timetable_id === data.timetable_id);
      orig[index] = data;
      setTimetableData(orig);
    });
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
