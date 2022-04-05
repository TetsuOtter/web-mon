import { AnyAction, combineReducers } from "redux";
import { dataManager } from "./dataManager";

export interface ActionWithPayload<TPayload> extends AnyAction {
  type: string,
  payload: TPayload,
}

export const reducer = combineReducers({
  dataManager,
});
