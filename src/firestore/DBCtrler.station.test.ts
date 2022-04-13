import {
  assertFails,
  assertSucceeds,
} from "@firebase/rules-unit-testing";
import { DBCtrler } from "./DBCtrler";
import { TLineDocument, TTimetableDocument, TStationDocument } from "./DBCtrler.types";
import { testRunner } from "./DBCtrler.test";

test("Create/Get/Delete Station Test", testRunner(async (env) => {
  const owner_id = "test_user_id_3";
  const ctx_owner = env.authenticatedContext(owner_id);
  const ctx_anonymous = env.unauthenticatedContext();

  const db_owner = new DBCtrler(ctx_owner.firestore(), true);
  const db_anonymous = new DBCtrler(ctx_anonymous.firestore(), true);

  const expect_line_data: TLineDocument = {
    can_read: [owner_id],
    can_write: [owner_id],
    disp_name: "サンプル線",
    hashed_read_pw: new Map<string, Date>(),
    hashed_write_pw: new Map<string, Date>(),
    tag_list: [],
    time_multipl: 1
  };
  const expect_timetable_data: TTimetableDocument = {
    tags: [],
    train_id: "A123D",
    sec_sys_train_id: "PA123D",
    sec_sys_sta_pass_setting: false,
    direction: "Inbound",
    radio_ch: "A9",
    line_color: "FF88CC",
    train_type: "新快速",
    dep_from_name: "京都",
    dep_from_time: new Date(),
    dep_from_track_num: "N1",
    work_to_name: "大阪",
    work_to_time: new Date(),
    work_to_track_num: "OSK99",
    last_stop_name: "姫路",
    last_stop_time: new Date(),
    last_stop_track_num: "HMG123",
    office_name: "臨時ABC",
    work_number: "休休999",
    effected_date: new Date(),
    additional_info: "付帯情報があれば記載します",
    next_work: null
  };
  const expect_station_data: TStationDocument = {
    full_name: "省略のない駅名",
    name_len_4: "四字駅名",
    location: 1.23,
    required_time_to_this_sta: 123,
    arrive_time: new Date(),
    departure_time: new Date(),
    is_pass: true,
    arr_symbol: "↓",
    dep_symbol: "===",
    track_num: "南南東12.3番線",
    run_in_limit: 0,
    run_out_limit: 99,
    sta_work: "分",
    sta_color: "FFFFFF"
  }


  const line_data = await assertSucceeds(db_owner.createNewLineData(owner_id, expect_line_data.disp_name));
  const timetable_data = await assertSucceeds(db_owner.addTimetableDoc(line_data.id, expect_timetable_data));
  const station_data = await assertSucceeds(db_owner.addStationDoc(line_data.id, timetable_data.id, expect_station_data));

  await assertFails(db_anonymous.getStationDoc(line_data.id, timetable_data.id, station_data.id));
  const get_station_result = await assertSucceeds(db_owner.getStationDoc(line_data.id, timetable_data.id, station_data.id));

  expect(get_station_result.data()).toStrictEqual(expect_station_data);

  await assertFails(db_anonymous.deleteStationDoc(line_data.id, timetable_data.id, station_data.id));

  const before_delete_result = await assertSucceeds(db_owner.getStationDoc(line_data.id, timetable_data.id, station_data.id));
  expect(before_delete_result.exists()).toEqual(true);

  await assertSucceeds(db_owner.deleteStationDoc(line_data.id, timetable_data.id, station_data.id));

  const after_delete_result = await assertSucceeds(db_owner.getStationDoc(line_data.id, timetable_data.id, station_data.id));
  expect(after_delete_result.exists()).not.toEqual(true);
}));

test("Create/Get Some Station Test", testRunner(async (env) => {
  const owner_id = "test_user_id_3";
  const ctx_owner = env.authenticatedContext(owner_id);
  const db_owner = new DBCtrler(ctx_owner.firestore(), true);

  const expect_timetable_data: TTimetableDocument = {
    tags: [],
    train_id: "A123D",
    sec_sys_train_id: "PA123D",
    sec_sys_sta_pass_setting: false,
    direction: "Inbound",
    radio_ch: "A9",
    line_color: "FF88CC",
    train_type: "新快速",
    dep_from_name: "京都",
    dep_from_time: new Date(),
    dep_from_track_num: "N1",
    work_to_name: "大阪",
    work_to_time: new Date(),
    work_to_track_num: "OSK99",
    last_stop_name: "姫路",
    last_stop_time: new Date(),
    last_stop_track_num: "HMG123",
    office_name: "臨時ABC",
    work_number: "休休999",
    effected_date: new Date(),
    additional_info: "付帯情報があれば記載します",
    next_work: null
  };
  const expect_station_data: TStationDocument = {
    full_name: "省略のない駅名",
    name_len_4: "四字駅名",
    location: 1.23,
    required_time_to_this_sta: 123,
    arrive_time: new Date(),
    departure_time: new Date(),
    is_pass: true,
    arr_symbol: "↓",
    dep_symbol: "===",
    track_num: "南南東12.3番線",
    run_in_limit: 0,
    run_out_limit: 99,
    sta_work: "分",
    sta_color: "FFFFFF"
  }


  const line_data = await assertSucceeds(db_owner.createNewLineData(owner_id, "サンプル線"));
  const timetable_data = await assertSucceeds(db_owner.addTimetableDoc(line_data.id, expect_timetable_data));
  const station_data_1 = await assertSucceeds(db_owner.addStationDoc(line_data.id, timetable_data.id, expect_station_data));
  const station_data_2 = await assertSucceeds(db_owner.addStationDoc(line_data.id, timetable_data.id, { ...expect_station_data, location: 0.1 }));
  const station_data_3 = await assertSucceeds(db_owner.addStationDoc(line_data.id, timetable_data.id, { ...expect_station_data, location: 0.5 }));

  const getResult = await assertSucceeds(db_owner.get1to9StationDocs(line_data.id, timetable_data.id));

  expect(getResult.size).toBe(3);
  expect(getResult.docs[0].id).toBe(station_data_2.id);
  expect(getResult.docs[1].id).toBe(station_data_3.id);
  expect(getResult.docs[2].id).toBe(station_data_1.id);
}));
