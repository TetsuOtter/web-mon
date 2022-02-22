import {
  initializeTestEnvironment,
  RulesTestEnvironment,
  assertFails,
  assertSucceeds,
  TestEnvironmentConfig,
} from "@firebase/rules-unit-testing";
import { DBCtrler } from "./DBCtrler";
import { TLineDocument, TTimetableDocument } from "./DBCtrler.types";
import fs from "fs";

//#region test env
/**
 * テスト用の実行環境情報を生成する
 * @param projectId 使用するプロジェクトID
 * @returns テスト環境情報
 */
function getTestEnv(projectId?: string): Promise<RulesTestEnvironment> {
  const cfg: TestEnvironmentConfig = {
    projectId:
      "demo-" +
      (projectId ?? Math.floor(Math.random() * Math.pow(10, 8)).toString()),
    firestore: {
      host: "localhost",
      port: 8080,
      rules: fs.readFileSync("firestore.rules", "utf8"),
    },
  };

  console.info("Current Project ID: ", cfg.projectId);

  return initializeTestEnvironment(cfg);
}

/**
 * テスト実行を行う「処理」を返す
 * @param testFunc テストの本体
 * @returns テストを行う「処理」
 */
function testRunner(
  testFunc: (testEnv: RulesTestEnvironment) => Promise<unknown>
) {
  return () =>
    getTestEnv().then((v) =>
      testFunc(v).finally(() => {
        // 最終的にテスト環境は破棄する
        v.cleanup().catch(console.warn);
      })
    );
}
//#endregion

test("Create/Get Line Test", testRunner(async (env) => {
  const owner_id = "test_user_id";
  const ctx_owner = env.authenticatedContext(owner_id);
  const ctx_anonymous = env.unauthenticatedContext();

  const db_owner = new DBCtrler(ctx_owner.firestore());
  const db_anonymous = new DBCtrler(ctx_anonymous.firestore());

  const expect_line_data: TLineDocument = {
    can_read: [owner_id],
    can_write: [owner_id],
    disp_name: "サンプル線",
    hashed_read_pw: new Map<string, Date>(),
    hashed_write_pw: new Map<string, Date>(),
    tag_list: [],
    time_multipl: 1
  };
  const line_data = await assertSucceeds(db_owner.createNewLineData(owner_id, expect_line_data.disp_name));
  await assertFails(db_anonymous.getLineDoc(line_data.id));
  const line_get_result = await assertSucceeds(db_owner.getLineDoc(line_data.id));

  expect(line_get_result.data()).toStrictEqual(expect_line_data);
}));

test("Create/Get Timetable Test", testRunner(async (env) => {
  const owner_id = "test_user_id_2";
  const ctx_owner = env.authenticatedContext(owner_id);
  const ctx_anonymous = env.unauthenticatedContext();

  const db_owner = new DBCtrler(ctx_owner.firestore());
  const db_anonymous = new DBCtrler(ctx_anonymous.firestore());

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
