import { addDoc, arrayRemove, arrayUnion, collection, CollectionReference, deleteDoc, doc, DocumentReference, DocumentSnapshot, enableIndexedDbPersistence, Firestore, getDocFromCache, getDocFromServer, getDocsFromCache, getDocsFromServer, orderBy, Query, query, QueryConstraint, QuerySnapshot, updateDoc, where, WithFieldValue } from "firebase/firestore";
import { FirebaseFirestore as CompatFirestore } from "@firebase/firestore-types";
import { TLineDocument, TStationDocument, TTimetableDocument } from "./DBCtrler.types";
import { LineDocConverter, StationDocConverter, TimetableDocConverter, TimetableDocToFirestore } from "./DBCtrler.conv";

const COLLECTION_NAME_LINE = "line";
const COLLECTION_NAME_TIMETABLE = "timetables";
const COLLECTION_NAME_STATION = "stations";

export class DBCtrler {
  public readonly db: Firestore;

  public loadFromServerAnyway: boolean;

  constructor(db: Firestore | CompatFirestore, loadFromServerAnyway?: boolean) {
    this.db = db as Firestore;
    this.loadFromServerAnyway = loadFromServerAnyway ?? false;

    enableIndexedDbPersistence(this.db)
      .catch(() => this.loadFromServerAnyway = true);
  }

  private getDocFromCacheOrServer<T>(docRef: DocumentReference<T>, loadFromServerAnyway = false): Promise<DocumentSnapshot<T>> {
    if (this.loadFromServerAnyway || loadFromServerAnyway)
      return getDocFromServer(docRef);

    return getDocFromCache(docRef)
      .then(v => v)
      .catch(reason => {
        console.debug("get a doc from cache failed (reason:", reason);
        return getDocFromServer(docRef);
      });
  }

  private getDocsFromCacheOrServer<T>(docRef: Query<T>, loadFromServerAnyway = false): Promise<QuerySnapshot<T>> {
    if (this.loadFromServerAnyway || loadFromServerAnyway)
      return getDocsFromServer(docRef);

    return getDocsFromCache(docRef)
      .then(v => v)
      .catch(reason => {
        console.debug("get docs from cache failed (reason:", reason);
        return getDocsFromServer(docRef);
      });
  }

  //#region Reference Generators
  public _LineDocRef(id: string): DocumentReference<TLineDocument> {
    return doc(this.db, COLLECTION_NAME_LINE, id).withConverter(LineDocConverter);
  }
  public _LineCollectionRef(): CollectionReference<TLineDocument> {
    return collection(this.db, COLLECTION_NAME_LINE).withConverter(LineDocConverter);
  }

  public _TimetableDocRef(line_id: string, timetable_id: string): DocumentReference<TTimetableDocument> {
    return doc(this.db, COLLECTION_NAME_LINE, line_id, COLLECTION_NAME_TIMETABLE, timetable_id).withConverter(TimetableDocConverter);
  }
  public _TimetableCollectionRef(line_id: string): CollectionReference<TTimetableDocument> {
    return collection(this.db, COLLECTION_NAME_LINE, line_id, COLLECTION_NAME_TIMETABLE).withConverter(TimetableDocConverter);
  }

  public _StationDocRef(line_id: string, timetable_id: string, station_id: string): DocumentReference<TStationDocument> {
    return doc(this.db, COLLECTION_NAME_LINE, line_id, COLLECTION_NAME_TIMETABLE, timetable_id, COLLECTION_NAME_STATION, station_id).withConverter(StationDocConverter);
  }
  public _StationCollectionRef(line_id: string, timetable_id: string): CollectionReference<TStationDocument> {
    return collection(this.db, COLLECTION_NAME_LINE, line_id, COLLECTION_NAME_TIMETABLE, timetable_id, COLLECTION_NAME_STATION).withConverter(StationDocConverter);
  }
  //#endregion

  //#region get methods
  public getLineDoc(line_id: string): Promise<DocumentSnapshot<TLineDocument>> {
    return this.getDocFromCacheOrServer(this._LineDocRef(line_id));
  }

  public getLineDocs(user_id?: string, loadFromServerAnyway = false): Promise<QuerySnapshot<TLineDocument>> {
    const user_id_arr = [""];
    if (user_id !== undefined)
      user_id_arr.push(user_id);

    return this.getDocsFromCacheOrServer(query(this._LineCollectionRef(), where("can_read", "array-contains-any", user_id_arr)), loadFromServerAnyway);
  }

  public getTimetableDoc(line_id: string, timetable_id: string, loadFromServerAnyway: boolean = false): Promise<DocumentSnapshot<TTimetableDocument>> {
    return this.getDocFromCacheOrServer(this._TimetableDocRef(line_id, timetable_id), loadFromServerAnyway);
  }

  public getAllTimetableDocs(line_id: string, loadFromServerAnyway: boolean = false): Promise<QuerySnapshot<TTimetableDocument>> {
    return this.getDocsFromCacheOrServer(this._TimetableCollectionRef(line_id), loadFromServerAnyway);
  }
  public getTimetableDocs_Query(line_id: string, ...queryArr: QueryConstraint[]): Promise<QuerySnapshot<TTimetableDocument>> {
    return this.getDocsFromCacheOrServer(query(this._TimetableCollectionRef(line_id), ...queryArr));
  }
  public getTimetableDocs_Tag(line_id: string, tag: string): Promise<QuerySnapshot<TTimetableDocument>> {
    return this.getTimetableDocs_Query(line_id, where("tags", "array-contains", tag));
  }
  public getTimetableDocs_TrainID(line_id: string, train_id: string): Promise<QuerySnapshot<TTimetableDocument>> {
    return this.getTimetableDocs_Query(line_id, where("train_id", "array-contains", train_id));
  }

  public getStationDoc(line_id: string, timetable_id: string, station_id: string): Promise<DocumentSnapshot<TStationDocument>> {
    return this.getDocFromCacheOrServer(this._StationDocRef(line_id, timetable_id, station_id));
  }

  public get1to9StationDocs(line_id: string, timetable_id: string): Promise<QuerySnapshot<TStationDocument>> {
    return this.getDocsFromCacheOrServer(query(this._StationCollectionRef(line_id, timetable_id), orderBy("location")));
  }
  //#endregion

  //#region add/update/remove LINE methods
  public createNewLineData(user_id: string, disp_name: string, time_multipl: number = 1): Promise<DocumentReference<TLineDocument>> {
    const data: TLineDocument = {
      can_read: [user_id],
      can_write: [user_id],
      disp_name: disp_name,
      tag_list: [],
      hashed_read_pw: new Map<string, Date>(),
      hashed_write_pw: new Map<string, Date>(),
      time_multipl: time_multipl
    };

    return addDoc(this._LineCollectionRef(), data);
  }
  public updateLineData(line_id: string, data: Partial<WithFieldValue<TLineDocument>>): Promise<void> {
    return updateDoc(this._LineDocRef(line_id), data);
  }

  public addReadableUsers(line_id: string, ...user_id: string[]): Promise<void> {
    return this.updateLineData(line_id, {
      can_read: arrayUnion(...user_id)
    });
  }
  public removeReadableUsers(line_id: string, ...user_id: string[]): Promise<void> {
    return this.updateLineData(line_id, {
      can_read: arrayRemove(...user_id)
    });
  }
  public addWritableUsers(line_id: string, ...user_id: string[]): Promise<void> {
    return this.updateLineData(line_id, {
      can_write: arrayUnion(...user_id)
    });
  }
  public removeWritableUsers(line_id: string, ...user_id: string[]): Promise<void> {
    return this.updateLineData(line_id, {
      can_write: arrayRemove(...user_id)
    });
  }
  public makePublic(line_id: string): Promise<void> {
    return this.addReadableUsers(line_id, "");
  }
  public makePrivate(line_id: string): Promise<void> {
    return this.removeReadableUsers(line_id, "");
  }

  public changeLineDispName(line_id: string, newName: string): Promise<void> {
    return this.updateLineData(line_id, {
      disp_name: newName
    });
  }

  public addTagsToLineDoc(line_id: string, ...tags: string[]): Promise<void> {
    return this.updateLineData(line_id, {
      tag_list: arrayUnion(...tags)
    });
  }
  public removeTagsToLineDoc(line_id: string, ...tags: string[]): Promise<void> {
    return this.updateLineData(line_id, {
      tag_list: arrayRemove(...tags)
    });
  }

  public updateTimeMultipl(line_id: string, val: number): Promise<void> {
    return this.updateLineData(line_id, {
      time_multipl: val
    });
  }

  // 削除には未対応 (Cloud Functionsを使用して完全に削除できるようにする)
  // ref : https://firebase.google.com/docs/firestore/solutions/delete-collections?hl=ja

  //#endregion

  public addTimetableDoc(line_id: string, data: TTimetableDocument): Promise<DocumentReference<TTimetableDocument>> {
    return addDoc(this._TimetableCollectionRef(line_id), data);
  }
  public updateTimetableDoc(line_id: string, timetable_id: string, data: Partial<TTimetableDocument>): Promise<void> {
    return updateDoc(this._TimetableDocRef(line_id, timetable_id), TimetableDocToFirestore(data));
  }

  // Timetable削除は未対応

  public addStationDoc(line_id: string, timetable_id: string, data: TStationDocument): Promise<DocumentReference<TStationDocument>> {
    return addDoc(this._StationCollectionRef(line_id, timetable_id), data);
  }
  public updateStationDoc(line_id: string, timetable_id: string, station_id: string, data: Partial<TStationDocument>): Promise<void> {
    return updateDoc(this._StationDocRef(line_id, timetable_id, station_id), data);
  }
  public deleteStationDoc(line_id: string, timetable_id: string, station_id: string): Promise<void> {
    return deleteDoc(this._StationDocRef(line_id, timetable_id, station_id));
  }
}
