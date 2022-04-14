import { User } from "firebase/auth";
import { DBCtrler } from "../firestore/DBCtrler";
import { TStationDocument, TTimetableDocument, TLineDocument } from "../firestore/DBCtrler.types";
import { firestore } from "../firestore/firebaseApp";

export interface SharedState {
  dbCtrler: DBCtrler | undefined,

  currentUser: User | null,

  lineData: TLineDocument | undefined,
  lineDataId: string,

  canEditThisLine: boolean,

  trainData: TTimetableDocument | undefined,
  trainDataId: string,

  stations: TStationDataListStruct[],
  currentStationId: string,

  timetableDataList: TTimetableDataListStruct[],

  lineDataList: TLineDataListStruct[],

  isMenuOpen: boolean,
}

export const intiialSharedState: SharedState = {
  dbCtrler: new DBCtrler(firestore),

  currentUser: null,

  lineData: undefined,
  lineDataId: "",

  canEditThisLine: false,

  trainData: undefined,
  trainDataId: "",

  stations: [],
  currentStationId: "",

  timetableDataList: [],

  lineDataList: [],

  isMenuOpen: false,
};

export interface DocId {
  document_id: string,
};

export type TLineDataListStruct = (DocId & TLineDocument);

export type TTimetableDataListStruct = (DocId & TTimetableDocument);

export type TStationDataListStruct = (DocId & TStationDocument);

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
