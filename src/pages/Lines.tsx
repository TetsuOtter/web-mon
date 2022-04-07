import MaterialTable, { Action, Column } from 'material-table';
import { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateParams, TIMETABLE_SELECT_PAGE_URL } from '../index';
import { TLineDocument } from '../firestore/DBCtrler.types';
import { State } from '../redux/reducer';
import { useSelector } from 'react-redux';

interface LineDataTableStruct extends TLineDocument {
  line_id: string,
}

const COLUMNS: Column<LineDataTableStruct>[] = [
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
    field: "line_id",
    editable: "never"
  },
];

function toLineDataTableStruct(id: string, d: TLineDocument): LineDataTableStruct {
  return {
    ...d,
    line_id: id,
  };
}

const reduxSelector = (state: State) => {
  return {
    db: state.setCurrentUserReducer.dbCtrler,
    uid: state.setCurrentUserReducer.currentUser?.uid,
  };
};

export const Lines = () => {
  const [lineData, setLineData] = useState<LineDataTableStruct[]>([]);
  const navigate = useNavigate();
  const { db, uid } = useSelector(reduxSelector);

  useEffect(() => {
    db?.getLineDocs(undefined, true).then(result => setLineData(result.docs.map(v => toLineDataTableStruct(v.id, v.data()))));
  }, [db]);

  const OPEN_THIS_LINE: Action<LineDataTableStruct> = {
    icon: "open_in_browser",
    tooltip: "開く",
    onClick: (_, data) => {
      const d = Array.isArray(data) ? data[0] : data;
      navigate(`${TIMETABLE_SELECT_PAGE_URL}${generateParams({ "line-id": d.line_id })}`);
    }
  };

  const RELOAD_THIS_LINE: Action<LineDataTableStruct> = {
    icon: "refresh",
    tooltip: "更新",
    onClick: (_, data) => {
      const d = Array.isArray(data) ? data[0] : data;

      db?.getLineDoc(d.line_id).then(result => {
        const index = lineData.findIndex(v => v.line_id === d.line_id);
        const orig = Array.from(lineData);
        const data = result.data();
        if (data !== undefined) {
          orig[index] = toLineDataTableStruct(result.id, data);
          setLineData(orig);
        }
      });
    }
  }

  const getIsEditable = (data?: LineDataTableStruct): boolean => {
    return !!uid;
  };

  const onRowAdd = (data: LineDataTableStruct): Promise<unknown> => {
    if (uid === undefined || db === undefined)
      return Promise.reject("サインインして下さい");
    return db.createNewLineData(uid, data.disp_name)
      .then(async (v) => {
        await db.updateTimeMultipl(v.id, data.time_multipl);

        const result = (await db.getLineDoc(v.id)).data();
        if (result !== undefined)
          lineData.push(toLineDataTableStruct(v.id, result));
        return;
      });
  };

  const onRowDelete = (data: LineDataTableStruct): Promise<unknown> => {
    return Promise.resolve();
  };

  const onRowUpdate = (data: LineDataTableStruct): Promise<unknown> => {
    return Promise.resolve();
  };

  return (<MaterialTable
    columns={COLUMNS}
    actions={[
      OPEN_THIS_LINE,
      RELOAD_THIS_LINE,
    ]}
    data={lineData}
    title="路線一覧"
    editable={{
      isEditable: getIsEditable,
      isDeletable: getIsEditable,

      onRowAdd: uid ? onRowAdd : undefined,
      onRowDelete: uid ? onRowDelete : undefined,
      onRowUpdate: uid ? onRowUpdate : undefined,
    }}
    options={{
      headerStyle: { whiteSpace: "nowrap" },
    }}
  >

  </MaterialTable>);
}
