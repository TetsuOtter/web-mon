import { User } from "firebase/auth";
import { TLineDocument, TStationDocument, TTimetableDocument } from "../firestore/DBCtrler.types";
import { TLineDataListStruct, TTimetableDataListStruct } from "./state.type";

export interface SetLinePayload {
  id: string,
  data: TLineDocument
};

export interface SetTrainPayload {
  id: string,
  data: TTimetableDocument
};

export type SetStationsPayload = Map<string, TStationDocument>;

export type SharedStatePayloadTypes = (
  SetLinePayload
  | SetTrainPayload
  | SetStationsPayload
  | User
  | null
  | TLineDataListStruct[]
  | TTimetableDataListStruct[]
);
