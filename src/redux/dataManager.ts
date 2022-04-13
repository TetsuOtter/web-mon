import { User } from "firebase/auth";
import { Reducer } from "redux";
import { SetLinePayload, SetTrainPayload, SharedStatePayloadTypes } from "./payload.type";
import { ActionWithPayload } from "./reducer";
import { intiialSharedState, SharedState, TLineDataListStruct, TStationDataListStruct, TTimetableDataListStruct } from "./state.type"
import * as TYPES from "./actionTypes";
import { getCanEditThisLine } from "../customHooks/useCanEditThisLine";

export const setSharedDataReducer: Reducer<SharedState, ActionWithPayload<SharedStatePayloadTypes>> = (state = intiialSharedState, action) => {
  switch (action.type) {
    case TYPES.SET_LINE:
      {
        const payload = action.payload as SetLinePayload;
        const canEditThisLine = getCanEditThisLine(state.currentUser, payload.data);
        if (state.lineDataId === payload.id)
          return {
            ...state,
            lineData: payload.data,
            canEditThisLine: canEditThisLine,
          };
        else
          return {
            ...state,
            lineDataId: payload.id,
            lineData: payload.data,
            canEditThisLine: canEditThisLine,
            trainDataId: "",
            trainData: undefined,
            stations: [],

            timetableDataList: [],
          };
      }

    case TYPES.SET_TRAIN:
      {
        const payload = action.payload as SetTrainPayload;
        if (state.trainDataId === payload.id)
          return {
            ...state,
            trainData: payload.data,
          };
        else
          return {
            ...state,
            trainDataId: payload.id,
            trainData: payload.data,
            stations: [],
          };
      }

    case TYPES.SET_STATIONS:
      {
        const payload = action.payload as TStationDataListStruct[];
        return {
          ...state,
          stations: payload,
        };
      }

    case TYPES.SET_CURRENT_STATION:
      {
        const payload = action.payload as string;
        return {
          ...state,
          currentStationId: payload,
        };
      }

    case TYPES.SET_USER:
      {
        const payload = action.payload as (User | null);
        return {
          ...state,
          currentUser: payload,
          canEditThisLine: getCanEditThisLine(payload, state.lineData),
        };
      }

    case TYPES.SET_LINE_LIST:
      {
        const payload = action.payload as TLineDataListStruct[];
        return {
          ...state,
          lineDataList: payload,
        };
      }

    case TYPES.SET_TIMETABLE_LIST:
      {
        const payload = action.payload as TTimetableDataListStruct[];
        return {
          ...state,
          timetableDataList: payload
        };
      }
  }
  return state;
};
