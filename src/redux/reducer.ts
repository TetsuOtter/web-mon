import { AnyAction, combineReducers } from "redux";
import { setLineReducer, setTrainReducer, setStationsReducer, setCurrentUserReducer } from "./dataManager";
import { State as _State } from "./state.type";

export interface ActionWithPayload<TPayload> extends AnyAction {
  type: string,
  payload: TPayload,
}

export const reducer = combineReducers({
  setLineReducer,
  setTrainReducer,
  setStationsReducer,
  setCurrentUserReducer,
});

export interface State {
  setLineReducer: _State,
  setTrainReducer: _State,
  setStationsReducer: _State,
  setCurrentUserReducer: _State,
};
