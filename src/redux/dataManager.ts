import { User } from "firebase/auth";
import { Reducer } from "redux";
import { SetLinePayload, SetStationsPayload, SetTrainPayload } from "./payload.type";
import { ActionWithPayload } from "./reducer";
import { intiialLinesPageState, intiialSharedState, LinesPageState, SharedState, TLineDataListStruct } from "./state.type"
import * as TYPES from "./actionTypes";

export const setSharedDataReducer: Reducer<SharedState, ActionWithPayload<SetLinePayload | SetTrainPayload | SetStationsPayload | User | null>> = (state = intiialSharedState, action) => {
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
          stations: undefined,
        };
      }

    case TYPES.SET_TRAIN:
      {
        const payload = action.payload as SetTrainPayload;
        return {
          ...state,
          trainDataId: payload.id,
          trainData: payload.data,
          stations: undefined,
        };
      }

    case TYPES.SET_STATIONS:
      {
        const payload = action.payload as SetStationsPayload;
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

  }
  return state;
};

export const setLinesDataReducer: Reducer<LinesPageState, ActionWithPayload<TLineDataListStruct[]>> = (state = intiialLinesPageState, action) => {
  switch (action.type) {
    case TYPES.SET_LINE_LIST:
      {
        const payload = action.payload as TLineDataListStruct[];
        return {
          ...state,
          lineDataList: payload
        };
      }

    default:
      return state;
  }
}
