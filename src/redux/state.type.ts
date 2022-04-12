import { User } from "firebase/auth";
import { DBCtrler } from "../firestore/DBCtrler";
import { TStationDocument, TTimetableDocument, TLineDocument } from "../firestore/DBCtrler.types";
import { firestore } from "../firestore/firebaseApp";

export interface SharedState {
  dbCtrler: DBCtrler | undefined,

  currentUser: User | null,

  lineData: TLineDocument | undefined,
  lineDataId: string

  trainData: TTimetableDocument | undefined,
  trainDataId: string,

  stations: Map<string, TStationDocument> | undefined,

  timetableDataList: TTimetableDataListStruct[],

  lineDataList: TLineDataListStruct[],
}

export const intiialSharedState: SharedState = {
  dbCtrler: new DBCtrler(firestore),

  currentUser: null,

  lineData: undefined,
  lineDataId: "",

  trainData: undefined,
  trainDataId: "",

  stations: undefined,

  timetableDataList: [],

  lineDataList: [],
};

export interface DocId {
  document_id: string,
};

export type TLineDataListStruct = (DocId & TLineDocument);

export type TTimetableDataListStruct = (DocId & TTimetableDocument);

export function ToWithId<T>(id: string, value: T): (DocId & T) {
  return {
    ...value,
    document_id: id,
  };
}

export function FromWithId<T>(withId: (DocId & T)): Omit<DocId & T, "document_id"> {
  const { document_id, ...ret } = withId;
  return ret;
}
