import { ActionWithPayload } from "./reducer";
import * as TYPES from "./actionTypes";
import { TLineDocument, TTimetableDocument } from "../firestore/DBCtrler.types";
import { SetLinePayload, SetStationsPayload, SetTrainPayload } from "./payload.type";
import { User } from "firebase/auth";
import { TLineDataList } from "./state.type";

export const setLine = (id: string, line: TLineDocument): ActionWithPayload<SetLinePayload> => ({
  type: TYPES.SET_LINE,
  payload: {
    id: id,
    data: line
  }
});

export const setTrain = (id: string, data: TTimetableDocument): ActionWithPayload<SetTrainPayload> => ({
  type: TYPES.SET_LINE,
  payload: {
    id: id,
    data: data
  }
});

export const setStations = (map: SetStationsPayload): ActionWithPayload<SetStationsPayload> => ({
  type: TYPES.SET_LINE,
  payload: map
});

export const setCurrentUserAction = (user: User | null): ActionWithPayload<User | null> => ({
  type: TYPES.SET_USER,
  payload: user
});

export const setLineDataList = (arr: TLineDataList): ActionWithPayload<TLineDataList> => ({
  type: TYPES.SET_LINE_LIST,
  payload: arr,
});
