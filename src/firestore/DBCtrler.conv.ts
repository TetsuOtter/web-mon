import { FirestoreDataConverter, Timestamp } from "firebase/firestore";
import { TFirestoreDictionary, TLineDocument, TServerSideLineDocument, TServerSideStationDocument, TServerSideTimetableDocument, TStationDocument, TTimetableDocument } from "./DBCtrler.types";

function toMap(dic: TFirestoreDictionary<Timestamp>): Map<string, Date> {
  return new Map<string, Date>(
    Object.entries(dic).map(value => [value[0], value[1].toDate()])
  );
}

function toDic(map: any): TFirestoreDictionary<Timestamp> | undefined {
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

function fromDate(date?: Date): Timestamp | undefined {
  return date ? Timestamp.fromDate(date) : undefined;
}

export const LineDocConverter: FirestoreDataConverter<TLineDocument> = {
  toFirestore: (_d) => {
    const d = _d as TLineDocument;
    const ret: Partial<TServerSideLineDocument> = {
      can_read: d?.can_read,
      can_write: d?.can_write,
      disp_name: d?.disp_name,
      tag_list: d?.tag_list,
      hashed_read_pw: toDic(d?.hashed_read_pw),
      hashed_write_pw: toDic(d?.hashed_write_pw),
      time_multipl: d?.time_multipl,
    };

    return ret;
  },

  fromFirestore: (ss, opt) => {
    const d = ss.data(opt) as TServerSideLineDocument;

    return {
      can_read: d.can_read,
      can_write: d.can_write,
      disp_name: d.disp_name,
      tag_list: d.tag_list,
      hashed_read_pw: toMap(d.hashed_read_pw),
      hashed_write_pw: toMap(d.hashed_write_pw),
      time_multipl: d.time_multipl,
    };
  }
}

const ServerSideTimetableDocConverter: FirestoreDataConverter<TServerSideTimetableDocument> = {
  toFirestore: (_d) => {
    const d = _d as TServerSideTimetableDocument;
    const ret: TTimetableDocument = {
      ...d,
      dep_from_time: d.dep_from_time.toDate(),
      work_to_time: d.work_to_time.toDate(),
      last_stop_time: d.last_stop_time.toDate(),
      effected_date: d.effected_date.toDate(),
      next_work: d.next_work?.withConverter(TimetableDocConverter) ?? null
    }
    return ret;
  },
  fromFirestore: (ss, opt) => {
    const d = ss.data() as TTimetableDocument;
    return {
      ...d,
      dep_from_time: Timestamp.fromDate(d?.dep_from_time),
      work_to_time: Timestamp.fromDate(d.work_to_time),
      last_stop_time: Timestamp.fromDate(d.last_stop_time),
      effected_date: Timestamp.fromDate(d.effected_date),
      next_work: d.next_work?.withConverter(ServerSideTimetableDocConverter) ?? null
    };
  }
}

export const TimetableDocConverter: FirestoreDataConverter<TTimetableDocument> = {
  toFirestore: (_d) => {
    const d = _d as TTimetableDocument;

    const ret: Partial<TServerSideTimetableDocument> = {
      tags: d?.tags,
      train_id: d?.train_id,
      sec_sys_train_id: d?.sec_sys_train_id,
      sec_sys_sta_pass_setting: d?.sec_sys_sta_pass_setting,
      direction: d?.direction,
      radio_ch: d?.radio_ch,
      line_color: d?.line_color,
      train_type: d?.train_type,
      dep_from_name: d?.dep_from_name,
      dep_from_time: fromDate(d?.dep_from_time),
      dep_from_track_num: d?.dep_from_track_num,
      work_to_name: d?.work_to_name,
      work_to_time: fromDate(d?.work_to_time),
      work_to_track_num: d?.work_to_track_num,
      last_stop_name: d?.last_stop_name,
      last_stop_time: fromDate(d?.last_stop_time),
      last_stop_track_num: d?.last_stop_track_num,
      office_name: d?.office_name,
      work_number: d?.work_number,
      effected_date: fromDate(d?.effected_date),
      additional_info: d?.additional_info,
      next_work: d?.next_work === null ? null : d?.next_work?.withConverter(ServerSideTimetableDocConverter)
    };
    return ret;
  },

  fromFirestore: (ss, opt) => {
    const d = ss.data(opt) as TServerSideTimetableDocument;

    return {
      tags: d.tags,
      train_id: d.train_id,
      sec_sys_train_id: d.sec_sys_train_id,
      sec_sys_sta_pass_setting: d.sec_sys_sta_pass_setting,
      direction: d.direction,
      radio_ch: d.radio_ch,
      line_color: d.line_color,
      train_type: d.train_type,
      dep_from_name: d.dep_from_name,
      dep_from_time: d.dep_from_time.toDate(),
      dep_from_track_num: d.dep_from_track_num,
      work_to_name: d.work_to_name,
      work_to_time: d.work_to_time.toDate(),
      work_to_track_num: d.work_to_track_num,
      last_stop_name: d.last_stop_name,
      last_stop_time: d.last_stop_time.toDate(),
      last_stop_track_num: d.last_stop_track_num,
      office_name: d.office_name,
      work_number: d.work_number,
      effected_date: d.effected_date.toDate(),
      additional_info: d.additional_info,
      next_work: d.next_work?.withConverter(TimetableDocConverter) ?? null
    };
  }
}

export const StationDocConverter: FirestoreDataConverter<TStationDocument> = {
  toFirestore: (_d) => {
    const d = _d as TStationDocument;
    const ret: TServerSideStationDocument = {
      full_name: d?.full_name,
      name_len_4: d?.name_len_4,
      location: d?.location,
      required_time_to_this_sta: d?.required_time_to_this_sta,
      arrive_time_hh: d?.arrive_time_hh,
      arrive_time_mm: d?.arrive_time_mm,
      arrive_time_ss: d?.arrive_time_ss,
      departure_time_hh: d?.departure_time_hh,
      departure_time_mm: d?.departure_time_mm,
      departure_time_ss: d?.departure_time_ss,
      is_pass: d?.is_pass,
      arr_symbol: d?.arr_symbol,
      dep_symbol: d?.dep_symbol,
      track_num: d?.track_num,
      run_in_limit: d?.run_in_limit,
      run_out_limit: d?.run_out_limit,
      sta_work: d?.sta_work,
      sta_color: d?.sta_color,
    };

    return ret;
  },

  fromFirestore: (ss, opt) => {
    const d = ss.data(opt) as TServerSideStationDocument;

    return {
      full_name: d.full_name,
      name_len_4: d.name_len_4,
      location: d.location,
      required_time_to_this_sta: d.required_time_to_this_sta,
      arrive_time_hh: d.arrive_time_hh,
      arrive_time_mm: d.arrive_time_mm,
      arrive_time_ss: d.arrive_time_ss,
      departure_time_hh: d.departure_time_hh,
      departure_time_mm: d.departure_time_mm,
      departure_time_ss: d.departure_time_ss,
      is_pass: d.is_pass,
      arr_symbol: d.arr_symbol,
      dep_symbol: d.dep_symbol,
      track_num: d.track_num,
      run_in_limit: d.run_in_limit,
      run_out_limit: d.run_out_limit,
      sta_work: d.sta_work,
      sta_color: d.sta_color,
    };
  }
}
