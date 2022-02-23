import {
  assertFails,
  assertSucceeds,
} from "@firebase/rules-unit-testing";
import { DBCtrler } from "./DBCtrler";
import { TLineDocument, TTimetableDocument } from "./DBCtrler.types";
import { testRunner } from "./DBCtrler.test";

test("Create/Get Timetable Test", testRunner(async (env) => {
  const owner_id = "test_user_id_2";
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
  const line_data = await assertSucceeds(db_owner.createNewLineData(owner_id, expect_line_data.disp_name));
  const timetable_data = await assertSucceeds(db_owner.addTimetableDoc(line_data.id, expect_timetable_data));
  await assertFails(db_anonymous.getTimetableDoc(line_data.id, timetable_data.id));
  const get_timetable_result = await assertSucceeds(db_owner.getTimetableDoc(line_data.id, timetable_data.id));

  expect(get_timetable_result.data()).toStrictEqual(expect_timetable_data);
}));
