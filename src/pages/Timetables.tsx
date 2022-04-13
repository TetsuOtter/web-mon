import MaterialTable, { Action, Column } from 'material-table';
import { MouseEventHandler, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateParams, getIsEditable as _getIsEditable, SHOW_TIMETABLE_PAGE_URL } from "../index";
import { State } from '../redux/reducer';
import { useDispatch, useSelector } from 'react-redux';
import { setTimetableDataList, setTrain } from "../redux/setters";
import { FromWithId, ToWithId, TTimetableDataListStruct } from '../redux/state.type';
import { IconButton } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { DEFAULT_DATE, getTodaysDate, TimetableDocInitValue } from '../firestore/DBCtrler.types.initValues';

const COLUMNS: Column<TTimetableDataListStruct>[] = [
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
      if (0 < d?.train_id?.length && d?.train_id?.length < 128)
        return true;
      else
        return {
          isValid: false,
          helperText: "1 Byte以上127 Byte以下"
        }
    }
  },
  { title: "P列番", field: "sec_sys_train_id", initialEditValue: "" },
  { title: "通過設定", field: "sec_sys_sta_pass_setting", type: "boolean", initialEditValue: false },
  { title: "無線番号", field: "radio_ch", initialEditValue: "" },
  { title: "線の色", field: "line_color", initialEditValue: "000000" },
  { title: "種別", field: "train_type", initialEditValue: "" },
  { title: "乗務開始駅", field: "dep_from_name", initialEditValue: "" },
  { title: "乗務開始時刻", field: "dep_from_time", type: "time", initialEditValue: DEFAULT_DATE },
  { title: "乗務開始番線", field: "dep_from_track_num", initialEditValue: "" },
  { title: "乗務終了駅", field: "work_to_name", initialEditValue: "" },
  { title: "乗務終了時刻", field: "work_to_time", type: "time", initialEditValue: DEFAULT_DATE },
  { title: "乗務終了番線", field: "work_to_track_num", initialEditValue: "" },
  { title: "列車終着駅", field: "last_stop_name", initialEditValue: "" },
  { title: "列車終着時刻", field: "last_stop_time", type: "time", initialEditValue: DEFAULT_DATE },
  { title: "列車終着番線", field: "last_stop_track_num", initialEditValue: "" },
  { title: "乗務員区所", field: "office_name", initialEditValue: "" },
  { title: "行路番号", field: "work_number", initialEditValue: "" },
  { title: "ダイヤ発効日", field: "effected_date", type: "date", initialEditValue: getTodaysDate() },
  { title: "付帯情報", field: "additional_info", type: "string", initialEditValue: "" },
  { title: "tags", field: "tags", editable: "never", render: () => (<p>(準備中)</p>), initialEditValue: [] },
  { title: "次列車", field: "next_work", editable: "never", render: () => (<p>(準備中)</p>), initialEditValue: null },
  { title: "(内部ID)", field: "document_id", editable: "never" },
];

const reduxSelector = (state: State) => {
  return {
    db: state.setSharedDataReducer.dbCtrler,
    uid: state.setSharedDataReducer.currentUser?.uid,
    line_id: state.setSharedDataReducer.lineDataId,
    line_data: state.setSharedDataReducer.lineData,
    timetableData: state.setSharedDataReducer.timetableDataList,
  };
};

export const Timetables = () => {
  const navigate = useNavigate();
  const { db, uid, line_id, line_data, timetableData } = useSelector(reduxSelector);
  const dispatch = useDispatch();

  const setTimetableData = (d: TTimetableDataListStruct[]) => dispatch(setTimetableDataList(d));

  // 指定された路線のデータを読み込む処理
  useEffect(() => {
    if (db === undefined || !line_id || timetableData.length > 0)
      return;

    loadTimetableDataList()?.then(v => {
      if (v.payload.length <= 0)
        loadTimetableDataList(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [line_id]);

  const OPEN_THIS_TRAIN: Action<TTimetableDataListStruct> = {
    icon: "open_in_browser",
    tooltip: "開く",
    onClick: (_, data) => {
      const d = Array.isArray(data) ? data[0] : data;

      if (line_id) {
        dispatch(setTrain(d.document_id, d));
        navigate(`${SHOW_TIMETABLE_PAGE_URL}${generateParams({ "line-id": line_id, "timetable-id": d.document_id })}`);
      }
    }
  };

  const RELOAD_THIS_TRAIN: Action<TTimetableDataListStruct> = {
    icon: "refresh",
    tooltip: "更新",
    onClick: (_, data) => {
      const d = Array.isArray(data) ? data[0] : data;

      if (!db || !line_id)
        return;

      db.getTimetableDoc(line_id, d.document_id, true).then(result => {
        const index = timetableData.findIndex(v => v.document_id === d.document_id);
        const orig = Array.from(timetableData);
        const data = result.data();
        if (data !== undefined) {
          orig[index] = ToWithId(result.id, data);
          setTimetableData(orig);
        }
      });
    }
  };

  const getIsEditable = (data: TTimetableDataListStruct): boolean => _getIsEditable(uid, line_data);

  const onRowAdd = (data: TTimetableDataListStruct): Promise<unknown> => {
    if (uid === undefined || db === undefined)
      return Promise.reject("サインインして下さい");
    if (!line_id)
      return Promise.reject("路線IDが指定されていません");

    data = {
      ...TimetableDocInitValue,
      ...data,
    };
    console.log(data);
    return db.addTimetableDoc(line_id, FromWithId(data)).then(v => {
      data.document_id = v.id;
      setTimetableData([...timetableData, data]);
    });
  };

  /* TODO: 列車の削除はサーバーサイドで行う処理であるため、そちらを実装し次第こちらにも実装する
  const onRowDelete = (data: TimetableDataTableStruct): Promise<unknown> => {
    return Promise.resolve();
  };
  */

  const onRowUpdate = (data: TTimetableDataListStruct): Promise<unknown> => {
    if (uid === undefined || db === undefined)
      return Promise.reject("サインインして下さい");
    if (!line_id)
      return Promise.reject("路線IDが指定されていません");

    return db.updateTimetableDoc(line_id, data.document_id, FromWithId(data)).then(() => {
      const orig = Array.from(timetableData);
      const index = orig.findIndex(v => v.document_id === data.document_id);
      orig[index] = data;
      setTimetableData(orig);
    });
  };

  const loadTimetableDataList = (loadFromOnline = false) => {
    return db?.getAllTimetableDocs(line_id, !!loadFromOnline).then(result =>
      dispatch(setTimetableDataList(result.docs.map(v => ToWithId(v.id, v.data()))))
    );
  };
  const RELOAD_ALL: MouseEventHandler<HTMLButtonElement> = () => loadTimetableDataList(true);

  return (<MaterialTable
    columns={COLUMNS}
    actions={[
      OPEN_THIS_TRAIN,
      RELOAD_THIS_TRAIN,
    ]}
    data={timetableData}
    title={(
      <div style={{ display: "flex" }}>
        <IconButton
          onClick={RELOAD_ALL}
          style={{ margin: "auto" }}>
          <Refresh />
        </IconButton>
        <h3 style={{ padding: "8pt, 0pt" }}>時刻表一覧</h3>
      </div>
    )}
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
