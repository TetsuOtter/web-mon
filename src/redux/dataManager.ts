import { User } from "firebase/auth";
import { Reducer } from "redux";
import { SetLinePayload, SetStationsPayload, SetTrainPayload } from "./payload.type";
import { ActionWithPayload } from "./reducer";
import { intiialSharedState, SharedState } from "./state.type"
import * as TYPES from "./actionTypes";

export const setSharedDataReducer: Reducer<SharedState, ActionWithPayload<SetLinePayload | SetTrainPayload | SetStationsPayload>> = (state = intiialSharedState, action) => {
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

  }
  return state;
};

export const setCurrentUserReducer: Reducer<SharedState, ActionWithPayload<User | null>> = (state = intiialSharedState, action) => {
  if (action.type === TYPES.SET_USER)
    return {
      ...state,
      currentUser: action.payload,
    };
  else
    return state;
}
