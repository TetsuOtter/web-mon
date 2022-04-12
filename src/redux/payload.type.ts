import { User } from "firebase/auth";
import { TLineDocument, TTimetableDocument } from "../firestore/DBCtrler.types";
import { TLineDataListStruct, TStationDataListStruct, TTimetableDataListStruct } from "./state.type";

export interface SetLinePayload {
  id: string,
  data: TLineDocument
};

export interface SetTrainPayload {
  id: string,
  data: TTimetableDocument
};

export type SharedStatePayloadTypes = (
  SetLinePayload
  | SetTrainPayload
  | TStationDataListStruct[]
  | User
  | null
  | TLineDataListStruct[]
  | TTimetableDataListStruct[]
);
