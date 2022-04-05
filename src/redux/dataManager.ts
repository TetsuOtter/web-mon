import { User } from "firebase/auth";
import { combineReducers, Reducer } from "redux";
import { TLineDocument, TStationDocument, TTimetableDocument } from "../firestore/DBCtrler.types";
import { ActionWithPayload } from "./reducer";
import { intiialState, State } from "./state.type"

const TYPE_SET_LINE = "SET_LINE";
const TYPE_SET_TRAIN = "SET_TRAIN";
const TYPE_SET_STATIONS = "SET_STATIONS";
const TYPE_SET_USER = "SET_USER";

export interface SetLinePayload {
  id: string,
  data: TLineDocument
};

export interface SetTrainPayload {
  id: string,
  data: TTimetableDocument
};

export type SetStationsPayload = Map<string, TStationDocument>;

export const setLine = (id: string, line: TLineDocument): ActionWithPayload<SetLinePayload> => ({
  type: TYPE_SET_LINE,
  payload: {
    id: id,
    data: line
  }
});

export const setTrain = (id: string, data: TTimetableDocument): ActionWithPayload<SetTrainPayload> => ({
  type: TYPE_SET_LINE,
  payload: {
    id: id,
    data: data
  }
});

export const setStations = (map: SetStationsPayload): ActionWithPayload<SetStationsPayload> => ({
  type: TYPE_SET_LINE,
  payload: map
});

export const setCurrentUserAction = (user: User | null): ActionWithPayload<User | null> => ({
  type: TYPE_SET_USER,
  payload: user
});

const setLineAction: Reducer<State, ActionWithPayload<SetLinePayload>> = (state = intiialState, action) => {
  if (action.type === TYPE_SET_LINE)
    return {
      ...state,
      lineDataId: action.payload.id,
      lineData: action.payload.data,
      trainDataId: "",
      trainData: undefined,
      stations: undefined,
    };
  else
    return state;
}

const setTrainAction: Reducer<State, ActionWithPayload<SetTrainPayload>> = (state = intiialState, action) => {
  if (action.type === TYPE_SET_TRAIN)
    return {
      ...state,
      trainDataId: action.payload.id,
      trainData: action.payload.data,
      stations: undefined,
    };
  else
    return state;
}

const setStationsAction: Reducer<State, ActionWithPayload<SetStationsPayload>> = (state = intiialState, action) => {
  if (action.type === TYPE_SET_STATIONS)
    return {
      ...state,
      stations: action.payload,
    };
  else
    return state;
}

const setCurrentUser: Reducer<State, ActionWithPayload<User | null>> = (state = intiialState, action) => {
  if (action.type === TYPE_SET_USER)
    return {
      ...state,
      currentUser: action.payload,
    };
  else
    return state;
}

export const dataManager = combineReducers({
  setLineAction,
  setTrainAction,
  setStationsAction,
  setCurrentUser,
});
