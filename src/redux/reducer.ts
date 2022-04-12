import { AnyAction, combineReducers } from "redux";
import { setLinesDataReducer, setSharedDataReducer, setTimetablesDataReducer } from "./dataManager";
import { LinesPageState, SharedState, TimetablesPageState } from "./state.type";

export interface ActionWithPayload<TPayload> extends AnyAction {
  type: string,
  payload: TPayload,
}

export const reducer = combineReducers({
  setSharedDataReducer,
  setLinesDataReducer,
  setTimetablesDataReducer,
});

export interface State {
  setSharedDataReducer: SharedState,
  setLinesDataReducer: LinesPageState,
  setTimetablesDataReducer: TimetablesPageState,
};
