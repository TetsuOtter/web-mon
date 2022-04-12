import { AnyAction, combineReducers } from "redux";
import { setSharedDataReducer, setCurrentUserReducer } from "./dataManager";
import { SharedState } from "./state.type";

export interface ActionWithPayload<TPayload> extends AnyAction {
  type: string,
  payload: TPayload,
}

export const reducer = combineReducers({
  setSharedDataReducer,
  setCurrentUserReducer,
});

export interface State {
  setSharedDataReducer: SharedState,
  setCurrentUserReducer: SharedState,
};
