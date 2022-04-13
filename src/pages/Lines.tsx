import MaterialTable, { Action, Column } from 'material-table';
import { MouseEventHandler, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateParams, TIMETABLE_SELECT_PAGE_URL } from '../index';
import { State } from '../redux/reducer';
import { useDispatch, useSelector } from 'react-redux';
import { setLine, setLineDataList } from '../redux/setters';
import { Refresh } from "@mui/icons-material"
import { IconButton } from '@mui/material';
import { TLineDataListStruct, ToWithId } from '../redux/state.type';

const COLUMNS: Column<TLineDataListStruct>[] = [
  {
    title: "表示名",
    field: "disp_name"
  },
  {
    title: "READ",
    editable: "never",
    render: rowData => (<p>{rowData.can_read.findIndex(v => v === "") >= 0 ? "In Public" : "Private"}</p>)
  },
  {
    title: "WRITE",
    editable: "never",
    render: rowData => (<p>{rowData.can_write.findIndex(v => v === "") >= 0 ? "In Public" : "Private"}</p>)
  },
  {
    title: "タグ一覧",
    editable: "never",
    render: () => (<p>(準備中)</p>)
  },
  {
    title: "時間の加速設定",
    field: "time_multipl",
    initialEditValue: 1,
    type: "numeric"
  },
  {
    title: "招待設定",
    editable: "never",
    render: () => (<p>(準備中)</p>)
  },
  {
    title: "(内部ID)",
    field: "document_id",
    editable: "never"
  },
];

const reduxSelector = (state: State) => {
  return {
    db: state.setSharedDataReducer.dbCtrler,
    uid: state.setSharedDataReducer.currentUser?.uid,
    lineData: state.setSharedDataReducer.lineDataList,
  };
};

export const Lines = () => {
  const navigate = useNavigate();
  const { db, uid, lineData } = useSelector(reduxSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (lineData.length <= 0)
      loadLineDataList(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, uid]);

  const OPEN_THIS_LINE: Action<TLineDataListStruct> = {
    icon: "open_in_browser",
    tooltip: "開く",
    onClick: (_, data) => {
      const d = Array.isArray(data) ? data[0] : data;
      navigate(`${TIMETABLE_SELECT_PAGE_URL}${generateParams({ "line-id": d.document_id })}`);
    }
  };

  const RELOAD_THIS_LINE: Action<TLineDataListStruct> = {
    icon: "refresh",
    tooltip: "更新",
    onClick: (_, data) => {
      const d = Array.isArray(data) ? data[0] : data;

      db?.getLineDoc(d.document_id).then(result => {
        const index = lineData.findIndex(v => v.document_id === d.document_id);
        const orig = Array.from(lineData);
        const data = result.data();
        if (data !== undefined) {
          orig[index] = ToWithId(result.id, data);
          setLineDataList(orig);
        }
      });
    }
  }

  const loadLineDataList = (loadFromOnline = false) => {
    return db?.getLineDocs(uid, !!loadFromOnline).then(result =>
      dispatch(setLineDataList(result.docs.map(v => ToWithId(v.id, v.data()))))
    );
  };
  const RELOAD_ALL: MouseEventHandler<HTMLButtonElement> = () => loadLineDataList(true);

  const getIsEditable = (data?: TLineDataListStruct): boolean => {
    return !!uid && (!!data?.can_write.includes("") || !!data?.can_write.includes(uid));
  };

  const onRowAdd = (data: TLineDataListStruct): Promise<unknown> => {
    if (!uid || !db)
      return Promise.reject("サインインして下さい");

    return db.createNewLineData(uid, data.disp_name, data.time_multipl)
      .then(async (v) => {
        const result = (await db.getLineDoc(v.id)).data();

        if (result !== undefined) {
          dispatch(setLine(v.id, result));
          dispatch(setLineDataList([...lineData, ToWithId(v.id, result)]));
        }
        return;
      });
  };

  /* TODO: 路線の削除はサーバーサイドで実行するため、その処理を実装し次第こちらにも実装する
  const onRowDelete = (data: LineDataTableStruct): Promise<unknown> => {
    return Promise.resolve();
  };
  */

  const onRowUpdate = (data: TLineDataListStruct): Promise<unknown> => {
    if (db === undefined)
      return Promise.reject("サインインして下さい");
    return db.updateLineData(data.document_id, {
      disp_name: data.disp_name,
      time_multipl: data.time_multipl
    }).then(() => {
      const after = Array.from(lineData);
      const index = after.findIndex(v => v.document_id === data.document_id);
      after[index] = data;
      dispatch(setLineDataList(after));
    });
  };

  return (<MaterialTable
    columns={COLUMNS}
    actions={[
      OPEN_THIS_LINE,
      RELOAD_THIS_LINE,
    ]}
    data={lineData}
    title={(
      <div style={{ display: "flex" }}>
        <IconButton
          onClick={RELOAD_ALL}
          style={{ margin: "auto" }}>
          <Refresh />
        </IconButton>
        <h3 style={{ padding: "8pt, 0pt" }}>路線一覧</h3>
      </div>
    )}
    editable={{
      isEditable: getIsEditable,
      isDeletable: getIsEditable,

      onRowAdd: uid ? onRowAdd : undefined,
      // onRowDelete: uid ? onRowDelete : undefined,
      onRowUpdate: uid ? onRowUpdate : undefined,
    }}
    options={{
      headerStyle: { whiteSpace: "nowrap" },
    }}
  >
  </MaterialTable>);
}
