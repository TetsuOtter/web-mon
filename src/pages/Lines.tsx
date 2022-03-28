import MaterialTable, { Action, Column } from 'material-table';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateParams, TIMETABLE_SELECT_PAGE_URL } from '../index';
import { DBCtrler } from '../firestore/DBCtrler';
import { TLineDocument } from '../firestore/DBCtrler.types';
import { firestore } from '../firestore/firebaseApp';

interface LineDataTableStruct
{
  line_id: string,
  disp_name: string,
  can_read_str: string,
  can_write_str: string,
  tag_list: string[],
  tag_list_str: string,
  time_multipl: number,
}

const COLUMNS: Column<LineDataTableStruct>[] = [
  { title: "表示名", field: "disp_name" },
  { title: "読み取り制限", field: "can_read_str" },
  { title: "書き込み制限", field: "can_write_str" },
  { title: "タグ一覧", field: "tag_list_str" },
  { title: "時間の加速設定", field: "time_multipl", initialEditValue: 1, type: "numeric" },
  { title: "(内部ID)", field: "line_id", editable: "never" },
];

function toLineDataTableStruct(id: string, d: TLineDocument): LineDataTableStruct
{
  return {
    line_id: id,
    disp_name: d.disp_name,
    can_read_str: d.can_read.findIndex(v => v === "") >= 0 ? "公開状態" : "非公開",
    can_write_str: d.can_write.findIndex(v => v === "") >= 0 ? "公開状態" : "非公開",
    tag_list: d.tag_list,
    tag_list_str: d.tag_list.join(","),
    time_multipl: d.time_multipl
  };
}

export const Lines = () => {
  const [lineData, setLineData] = useState<LineDataTableStruct[]>([]);
  const navigate = useNavigate();
  const db = new DBCtrler(firestore, true);

  useEffect(() => {
    db.getLineDocs().then(result => setLineData(result.docs.map(v => toLineDataTableStruct(v.id, v.data()))));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const OPEN_THIS_LINE: Action<LineDataTableStruct> = {
    icon: "open_in_browser",
    tooltip: "開く",
    onClick: (_, data) => {
      const d = Array.isArray(data) ? data[0] : data;
      navigate(`${TIMETABLE_SELECT_PAGE_URL}${generateParams({"line-id": d.line_id})}`);
    }
  };

  const RELOAD_THIS_LINE: Action<LineDataTableStruct> = {
    icon: "refresh",
    tooltip: "更新",
    onClick: (_, data) => {
      const d = Array.isArray(data) ? data[0] : data;

      db.getLineDoc(d.line_id).then(result => {
        const index = lineData.findIndex(v => v.line_id === d.line_id);
        const orig = Array.from(lineData);
        const data = result.data();
        if (data !== undefined)
        {
          orig[index] = toLineDataTableStruct(result.id, data);
          setLineData(orig);
        }
      });
    }
  }

  const getIsEditable = (data: LineDataTableStruct): boolean => {
    return true;
  };

  const onRowAdd = (data: LineDataTableStruct): Promise<unknown> => {
    return Promise.resolve();
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

      onRowAdd: onRowAdd,
      onRowDelete: onRowDelete,
      onRowUpdate: onRowUpdate,
    }}
  >

  </MaterialTable>);
}
