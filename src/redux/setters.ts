import { ActionWithPayload } from "./reducer";
import * as TYPES from "./actionTypes";
import { TLineDocument, TTimetableDocument } from "../firestore/DBCtrler.types";
import { SetLinePayload, SetTrainPayload } from "./payload.type";
import { User } from "firebase/auth";
import { TLineDataListStruct, TStationDataListStruct, TTimetableDataListStruct } from "./state.type";

export const setLine = (id: string, line: TLineDocument): ActionWithPayload<SetLinePayload> => ({
  type: TYPES.SET_LINE,
  payload: {
    id: id,
    data: line
  }
});

export const setTrain = (id: string, data: TTimetableDocument): ActionWithPayload<SetTrainPayload> => ({
  type: TYPES.SET_TRAIN,
  payload: {
    id: id,
    data: data
  }
});

export const setStations = (map: TStationDataListStruct[]): ActionWithPayload<TStationDataListStruct[]> => ({
  type: TYPES.SET_STATIONS,
  payload: map
});

export const setCurrentUserAction = (user: User | null): ActionWithPayload<User | null> => ({
  type: TYPES.SET_USER,
  payload: user
});

export const setLineDataList = (arr: TLineDataListStruct[]): ActionWithPayload<TLineDataListStruct[]> => ({
  type: TYPES.SET_LINE_LIST,
  payload: arr,
});

export const setTimetableDataList = (arr: TTimetableDataListStruct[]): ActionWithPayload<TTimetableDataListStruct[]> => ({
  type: TYPES.SET_TIMETABLE_LIST,
  payload: arr,
});
