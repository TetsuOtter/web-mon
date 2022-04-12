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
}

export const intiialSharedState: SharedState = {
  dbCtrler: new DBCtrler(firestore),

  currentUser: null,

  lineData: undefined,
  lineDataId: "",

  trainData: undefined,
  trainDataId: "",

  stations: undefined
};
