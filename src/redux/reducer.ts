import { AnyAction, combineReducers } from "redux";
import { setLinesDataReducer, setSharedDataReducer } from "./dataManager";
import { LinesPageState, SharedState } from "./state.type";

export interface ActionWithPayload<TPayload> extends AnyAction {
  type: string,
  payload: TPayload,
}

export const reducer = combineReducers({
  setSharedDataReducer,
  setLinesDataReducer,
});

export interface State {
  setSharedDataReducer: SharedState,
  setLinesDataReducer: LinesPageState,
};
