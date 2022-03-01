import { FirestoreDataConverter, Timestamp } from "firebase/firestore";
import { TFirestoreDictionary, TLineDocument, TServerSideLineDocument, TServerSideStationDocument, TServerSideTimetableDocument, TStationDocument, TTimetableDocument } from "./DBCtrler.types";

function toMap(dic: TFirestoreDictionary<Timestamp>): Map<string, Date>
{
  return new Map<string, Date>(
    Object.entries(dic).map(value => [value[0], value[1].toDate()])
  );
}

function toDic(map: any): TFirestoreDictionary<Timestamp> | undefined
{
  if (map instanceof Map) {
    const dst = new Map<string, Timestamp>();
    map.forEach((v, k) => {
      dst.set(k, Timestamp.fromDate(v));
    });

    return Object.fromEntries(dst);
  }
  else
    return undefined;
}

export const LineDocConverter: FirestoreDataConverter<TLineDocument> = {
  toFirestore: (_d) => {
    const d = _d as TLineDocument;
    const ret: Partial<TServerSideLineDocument> = {
      ...d,
      hashed_read_pw: toDic(d.hashed_read_pw),
      hashed_write_pw: toDic(d.hashed_write_pw)
    };

    return ret;
  },

  fromFirestore: (ss, opt) => {
    const d = ss.data(opt) as TServerSideLineDocument;

    return {
      ...d,
      hashed_read_pw: toMap(d.hashed_read_pw),
      hashed_write_pw: toMap(d.hashed_write_pw),
    };
  }
}

export const TimetableDocConverter: FirestoreDataConverter<TTimetableDocument> = {
  toFirestore: (_d) => {
    const d = _d as TTimetableDocument;

    return {
      ...d,
      dep_from_time: Timestamp.fromDate(d.dep_from_time),
      work_to_time: Timestamp.fromDate(d.work_to_time),
      last_stop_time: Timestamp.fromDate(d.last_stop_time),
      effected_date: Timestamp.fromDate(d.effected_date),
    };
  },

  fromFirestore: (ss, opt) => {
    const d = ss.data(opt) as TServerSideTimetableDocument;

    return {
      ...d,
      dep_from_time: d.dep_from_time.toDate(),
      work_to_time: d.work_to_time.toDate(),
      last_stop_time: d.last_stop_time.toDate(),
      effected_date: d.effected_date.toDate(),
      next_work: d.next_work?.withConverter(TimetableDocConverter) ?? null
    };
  }
}

export const StationDocConverter: FirestoreDataConverter<TStationDocument> = {
  toFirestore: (_d) => {
    const d = _d as TStationDocument;
    const ret: TServerSideStationDocument = {
      ...d,
    };

    return ret;
  },

  fromFirestore: (ss, opt) => {
    const d = ss.data(opt) as TServerSideStationDocument;

    return {
      ...d,
    };
  }
}
