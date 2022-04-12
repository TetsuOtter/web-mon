import { TLineDocument, TStationDocument, TTimetableDocument } from "../firestore/DBCtrler.types";

export interface SetLinePayload {
  id: string,
  data: TLineDocument
};

export interface SetTrainPayload {
  id: string,
  data: TTimetableDocument
};

export type SetStationsPayload = Map<string, TStationDocument>;
