import { AnyAction, combineReducers } from "redux";
import { DBCtrler } from "../firestore/DBCtrler";
import { TStationDocument, TTimetableDocument, TLineDocument } from "../firestore/DBCtrler.types";
import { firestore } from "../firestore/firebaseApp";
import { dataManager } from "./dataManager";

export interface ActionWithPayload<TPayload> extends AnyAction {
  type: string,
  payload: TPayload,
}

export interface State {
  dbCtrler: DBCtrler,

  lineData: TLineDocument | undefined,
  lineDataId: string

  trainData: TTimetableDocument | undefined,
  trainDataId: string,

  stations: Map<string, TStationDocument> | undefined,
}

export const intiialState: State = {
  dbCtrler: new DBCtrler(firestore),

  lineData: undefined,
  lineDataId: "",

  trainData: undefined,
  trainDataId: "",

  stations: undefined
};

export const reducer = combineReducers({
  dataManager,
});
