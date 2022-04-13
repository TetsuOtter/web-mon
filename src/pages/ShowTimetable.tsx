import MaterialTable, { Action, Column } from 'material-table';
import { MouseEventHandler, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateParams, WEST_MON_PAGE_ID } from "../index";
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../redux/reducer';
import { FromWithId, ToWithId, TStationDataListStruct } from '../redux/state.type';
import { setCurrentStationId, setStations } from '../redux/setters';
import { Refresh } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { DEFAULT_DATE, StationDocInitValue } from '../firestore/DBCtrler.types.initValues';

const COLUMNS: Column<TStationDataListStruct>[] = [
  {
    title: "駅位置",
    field: "location",
    type: "numeric",
    initialEditValue: 0,
  },
  {
    title: "駅名",
    field: "full_name",
    initialEditValue: "",
  },
  {
    title: "4文字\n駅名",
    field: "name_len_4",
    initialEditValue: "",
  },
  {
    title: "前駅からの\n所要時間\n[秒]",
    field: "required_time_to_this_sta",
    type: "numeric",
    initialEditValue: 0,
  },
  {
    title: "到着時刻",
    field: "arrive_time",
    type: "time",
    initialEditValue: DEFAULT_DATE,
  },
  {
    title: "到着時刻表示部に\n表示する文字",
    field: "arr_symbol",
    initialEditValue: "",
  },
  {
    title: "発車時刻",
    field: "departure_time",
    type: "time",
    initialEditValue: DEFAULT_DATE,
  },
  {
    title: "発車時刻表示部に\n表示する文字",
    field: "dep_symbol",
    initialEditValue: "",
  },
  {
    title: "通過駅TF",
    field: "is_pass",
    type: "boolean",
    initialEditValue: false,
  },
  {
    title: "着発\n番線",
    field: "track_num",
    initialEditValue: "",
  },
  {
    title: "進入\n制限\n[km/h]",
    field: "run_in_limit",
    type: "numeric",
    initialEditValue: 0
  },
  {
    title: "進出\n制限\n[km/h]",
    field: "run_out_limit",
    type: "numeric",
    initialEditValue: 0,
  },
  {
    title: "駅仕業",
    field: "sta_work",
    initialEditValue: "",
  },
  {
    title: "表示色",
    field: "sta_color",
    initialEditValue: "000000",
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
    user: state.setSharedDataReducer.currentUser,
    line_id: state.setSharedDataReducer.lineDataId,
    train_id: state.setSharedDataReducer.trainDataId,
    stations: state.setSharedDataReducer.stations,
  };
};

export const ShowTimetable = () => {
  const navigate = useNavigate();
  const { db, user, line_id, train_id, stations } = useSelector(reduxSelector);
  const dispatch = useDispatch();

  const setStationsData = (arr: TStationDataListStruct[]) => dispatch(setStations(arr));

  useEffect(() => {
    loadStationDataList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [train_id]);

  const START_FROM_THIS_STATION_IN_WESTMON: Action<TStationDataListStruct> = {
    icon: "open_in_browser",
    tooltip: "開く",
    onClick: (_, data) => {
      const d = Array.isArray(data) ? data[0] : data;
      if (line_id && train_id) {
        dispatch(setCurrentStationId(d.document_id));
        navigate(`/${WEST_MON_PAGE_ID}${generateParams({ "line-id": line_id, "timetable-id": train_id, "station-id": d.document_id })}`);
      }
    }
  };

  const RELOAD_THIS_STATION: Action<TStationDataListStruct> = {
    icon: "refresh",
    tooltip: "更新",
    onClick: (_, data) => {
      const d = Array.isArray(data) ? data[0] : data;

      if (!line_id || !train_id)
        return;

      db?.getStationDoc(line_id, train_id, d.document_id).then(result => {
        const index = stations.findIndex(v => v.document_id === d.document_id);
        const orig = Array.from(stations);
        const data = result.data();
        if (data !== undefined) {
          orig[index] = { ...data, document_id: result.id };
          setStationsData(orig);
        }
      });
    }
  }

  const getIsEditable = (data: TStationDataListStruct): boolean => {
    return !!user;
  };

  const onRowAdd = (data: TStationDataListStruct): Promise<unknown> => {
    if (line_id && train_id && db) {
      data = { ...StationDocInitValue, ...data };
      return db.addStationDoc(line_id, train_id, FromWithId(data)).then(v => {
        data.document_id = v.id;
        return dispatch(setStations([...stations, data]));
      });
    }
    else
      return Promise.reject();
  };

  const onRowDelete = (data: TStationDataListStruct): Promise<unknown> => {
    if (line_id && train_id && db)
      return db.deleteStationDoc(line_id, train_id, data.document_id).then(() =>
        dispatch(setStations(stations.filter(v => v.document_id !== data.document_id)))
      );
    else
      return Promise.reject();
  };

  const onRowUpdate = (data: TStationDataListStruct): Promise<unknown> => {
    if (line_id && train_id && db)
      return db.updateStationDoc(line_id, train_id, data.document_id, FromWithId(data)).then(() =>
        dispatch(setStations(stations.map(v => v.document_id === data.document_id ? data : v)))
      );
    else
      return Promise.reject();
  };

  const loadStationDataList = (loadfromServerAnyway?: boolean) => {
    if (line_id && train_id && db)
      return db.get1to9StationDocs(line_id, train_id).then(result =>
        dispatch(setStations(result.docs.map(v => ToWithId(v.id, v.data()))))
      );
    else
      return Promise.reject();
  };
  const RELOAD_ALL: MouseEventHandler<HTMLButtonElement> = () => loadStationDataList(true);

  return (<MaterialTable
    columns={COLUMNS}
    actions={[
      START_FROM_THIS_STATION_IN_WESTMON,
      RELOAD_THIS_STATION,
    ]}
    data={stations}
    title={(
      <div style={{ display: "flex" }}>
        <IconButton
          onClick={RELOAD_ALL}
          style={{ margin: "auto" }}>
          <Refresh />
        </IconButton>
        <h3 style={{ padding: "8pt, 0pt" }}>駅一覧</h3>
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

      onRowAdd: user ? onRowAdd : undefined,
      onRowDelete: user ? onRowDelete : undefined,
      onRowUpdate: user ? onRowUpdate : undefined,
    }}
  >

  </MaterialTable>);
}
