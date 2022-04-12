import { User } from "firebase/auth";
import { Reducer } from "redux";
import { SetLinePayload, SetTrainPayload, SharedStatePayloadTypes } from "./payload.type";
import { ActionWithPayload } from "./reducer";
import { intiialSharedState, SharedState, TLineDataListStruct, TStationDataListStruct, TTimetableDataListStruct } from "./state.type"
import * as TYPES from "./actionTypes";

export const setSharedDataReducer: Reducer<SharedState, ActionWithPayload<SharedStatePayloadTypes>> = (state = intiialSharedState, action) => {
  switch (action.type) {
    case TYPES.SET_LINE:
      {
        const payload = action.payload as SetLinePayload;
        return {
          ...state,
          lineDataId: payload.id,
          lineData: payload.data,
          trainDataId: "",
          trainData: undefined,
          stations: [],

          // LineIDに更新があった場合は、時刻表データにも変更があるはずであり、従ってreduxストアでのキャッシュをクリアしておく
          timetableDataList: state.lineDataId === payload.id ? state.timetableDataList : [],
        };
      }

    case TYPES.SET_TRAIN:
      {
        const payload = action.payload as SetTrainPayload;
        return {
          ...state,
          trainDataId: payload.id,
          trainData: payload.data,
        };
          stations: [],
      }

    case TYPES.SET_STATIONS:
      {
        const payload = action.payload as TStationDataListStruct[];
        return {
          ...state,
          stations: payload,
        };
      }
    case TYPES.SET_USER:
      {
        const payload = action.payload as (User | null);
        return {
          ...state,
          currentUser: payload,
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
