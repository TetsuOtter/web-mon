import {
  assertFails,
  assertSucceeds,
} from "@firebase/rules-unit-testing";
import { DBCtrler } from "./DBCtrler";
import { TLineDocument, TServerSideLineDocument } from "./DBCtrler.types";
import { testRunner } from "./DBCtrler.test";
import { addDoc } from "firebase/firestore";

test("Create/Get Line Test", testRunner(async (env) => {
  const owner_id = "test_user_id";
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
  const line_data = await assertSucceeds(db_owner.createNewLineData(owner_id, expect_line_data.disp_name));
  await assertFails(db_anonymous.getLineDoc(line_data.id));
  const line_get_result = await assertSucceeds(db_owner.getLineDoc(line_data.id));

  expect(line_get_result.data()).toStrictEqual(expect_line_data);
}));

test("LineData: Invalid Elements DataType Error Test", testRunner(async (env) => {
  const owner_id = "test_user_id";
  const ctx_owner = env.authenticatedContext(owner_id);

  const db_owner = new DBCtrler(ctx_owner.firestore(), true);

  const expect_line_data: TServerSideLineDocument = {
    can_read: [owner_id],
    can_write: [owner_id],
    disp_name: "サンプル線",
    hashed_read_pw: {},
    hashed_write_pw: {},
    tag_list: [],
    time_multipl: 1
  };

  await assertFails(addDoc(db_owner._LineCollectionRef().withConverter(null), {...expect_line_data, can_read: null}));
  await assertFails(addDoc(db_owner._LineCollectionRef().withConverter(null), {...expect_line_data, can_write: null}));
  await assertFails(addDoc(db_owner._LineCollectionRef().withConverter(null), {...expect_line_data, disp_name: 1.2}));
  await assertFails(addDoc(db_owner._LineCollectionRef().withConverter(null), {...expect_line_data, hashed_read_pw: "123"}));
  await assertFails(addDoc(db_owner._LineCollectionRef().withConverter(null), {...expect_line_data, hashed_write_pw: 123}));
  await assertFails(addDoc(db_owner._LineCollectionRef().withConverter(null), {...expect_line_data, tag_list: ""}));
  await assertFails(addDoc(db_owner._LineCollectionRef().withConverter(null), {...expect_line_data, time_multipl: 0.5}));
}));

test("LineData: Too Less/Much Data Error Test", testRunner(async (env) => {
  const owner_id = "test_user_id";
  const ctx_owner = env.authenticatedContext(owner_id);

  const db_owner = new DBCtrler(ctx_owner.firestore(), true);

  const expect_line_data: TServerSideLineDocument = {
    can_read: [owner_id],
    can_write: [owner_id],
    disp_name: "サンプル線",
    hashed_read_pw: {},
    hashed_write_pw: {},
    tag_list: [],
    time_multipl: 1
  };

  const { can_read: _1, ...wo_can_read } = expect_line_data;
  const { can_write: _2, ...wo_can_write } = expect_line_data;
  const { disp_name: _3, ...wo_disp_name } = expect_line_data;
  const { hashed_read_pw: _4, ...wo_hashed_read_pw } = expect_line_data;
  const { hashed_write_pw: _5, ...wo_hashed_write_pw } = expect_line_data;
  const { tag_list: _6, ...wo_tag_list } = expect_line_data;
  const { time_multipl: _7, ...wo_time_multipl } = expect_line_data;

  await assertFails(addDoc(db_owner._LineCollectionRef().withConverter(null), wo_can_read));
  await assertFails(addDoc(db_owner._LineCollectionRef().withConverter(null), wo_can_write));
  await assertFails(addDoc(db_owner._LineCollectionRef().withConverter(null), wo_disp_name));
  await assertFails(addDoc(db_owner._LineCollectionRef().withConverter(null), wo_hashed_read_pw));
  await assertFails(addDoc(db_owner._LineCollectionRef().withConverter(null), wo_hashed_write_pw));
  await assertFails(addDoc(db_owner._LineCollectionRef().withConverter(null), wo_tag_list));
  await assertFails(addDoc(db_owner._LineCollectionRef().withConverter(null), wo_time_multipl));
  await assertFails(addDoc(db_owner._LineCollectionRef().withConverter(null), {...expect_line_data, discarded_field: 123}));
}));

test("Create/Get/Update Many Line Test", testRunner(async (env) => {
  const owner1_id = "test_user_id_1";
  const owner2_id = "test_user_id_2";
  const owner3_id = "test_user_id_3";
  const ctx_owner1 = env.authenticatedContext(owner1_id);
  const ctx_owner2 = env.authenticatedContext(owner2_id);
  const ctx_owner3 = env.authenticatedContext(owner3_id);
  const ctx_anonymous = env.unauthenticatedContext();

  const db_owner1 = new DBCtrler(ctx_owner1.firestore(), true);
  const db_owner2 = new DBCtrler(ctx_owner2.firestore(), true);
  const db_owner3 = new DBCtrler(ctx_owner3.firestore(), true);
  const db_anonymous = new DBCtrler(ctx_anonymous.firestore(), true);

  const line_add_1 = await assertSucceeds(db_owner1.createNewLineData(owner1_id, "サンプル線1"));
  const line_add_3 = await assertSucceeds(db_owner3.createNewLineData(owner3_id, "サンプル線3"));
  const line_add_o1r2rw3 = await assertSucceeds(db_owner1.createNewLineData(owner1_id, "サンプル線o1r2rw3"));

  // 読み書き可能ユーザを追加
  await assertSucceeds(db_owner1.addReadableUsers(line_add_o1r2rw3.id, owner2_id, owner3_id));
  await assertSucceeds(db_owner1.addWritableUsers(line_add_o1r2rw3.id, owner3_id));

  // きちんと書き込みができているかどうかを確認する
  const getLineDocResult_1 = await assertSucceeds(db_owner1.getLineDoc(line_add_1.id));
  const getLineDocResult_2 = await assertSucceeds(db_owner2.getLineDoc(line_add_o1r2rw3.id));
  const getLineDocResult_3 = await assertSucceeds(db_owner3.getLineDoc(line_add_3.id));

  expect(getLineDocResult_1.exists()).toBe(true);
  expect(getLineDocResult_2.exists()).toBe(true);
  expect(getLineDocResult_3.exists()).toBe(true);

  // readableなlineをすべて取得する
  const getLinesResult_1 = await assertSucceeds(db_owner1.getLineDocs(owner1_id));
  const getLinesResult_2 = await assertSucceeds(db_owner2.getLineDocs(owner2_id));
  const getLinesResult_3 = await assertSucceeds(db_owner3.getLineDocs(owner3_id));
  const getLinesResult_Anonymous = await assertSucceeds(db_anonymous.getLineDocs());

  expect(getLinesResult_1.size).toBe(2); // サンプル線1, サンプル線o1r2rw3
  expect(getLinesResult_2.size).toBe(1); // サンプル線o1r2rw3
  expect(getLinesResult_3.size).toBe(2); // サンプル線3, サンプル線o1r2rw3
  expect(getLinesResult_Anonymous.size).toBe(0); // empty

  // サンプル線3をpublicにする
  await assertSucceeds(db_owner3.makePublic(line_add_3.id));

  const getLinesResult2_1 = await assertSucceeds(db_owner1.getLineDocs(owner1_id));
  const getLinesResult2_2 = await assertSucceeds(db_owner2.getLineDocs(owner2_id));
  const getLinesResult2_3 = await assertSucceeds(db_owner3.getLineDocs(owner3_id));
  const getLinesResult2_Anonymous = await assertSucceeds(db_anonymous.getLineDocs());

  expect(getLinesResult2_1.size).toBe(3); // サンプル線1, サンプル線3, サンプル線o1r2rw3
  expect(getLinesResult2_2.size).toBe(2); // サンプル線3, サンプル線o1r2rw3
  expect(getLinesResult2_3.size).toBe(2); // サンプル線3, サンプル線o1r2rw3
  expect(getLinesResult2_Anonymous.size).toBe(1); // サンプル線3

  // サンプル線3をprivateにする
  await assertSucceeds(db_owner3.makePrivate(line_add_3.id));

  const getLinesResult3_1 = await assertSucceeds(db_owner1.getLineDocs(owner1_id));
  const getLinesResult3_2 = await assertSucceeds(db_owner2.getLineDocs(owner2_id));
  const getLinesResult3_3 = await assertSucceeds(db_owner3.getLineDocs(owner3_id));
  const getLinesResult3_Anonymous = await assertSucceeds(db_anonymous.getLineDocs());

  expect(getLinesResult3_1.size).toBe(2); // サンプル線1, サンプル線o1r2rw3
  expect(getLinesResult3_2.size).toBe(1); // サンプル線o1r2rw3
  expect(getLinesResult3_3.size).toBe(2); // サンプル線3, サンプル線o1r2rw3
  expect(getLinesResult3_Anonymous.size).toBe(0); // empty
}));

test("Change Line Data Fields Test", testRunner(async (env) => {
  const owner_id = "test_user_id";
  const ctx_owner = env.authenticatedContext(owner_id);
  const db_owner = new DBCtrler(ctx_owner.firestore(), true);

  const line1add = await assertSucceeds(db_owner.createNewLineData(owner_id, "LINE1"));

  await assertSucceeds(db_owner.changeLineDispName(line1add.id, "LINE1N"));
  await assertSucceeds(db_owner.addTagsToLineDoc(line1add.id, "tag1", "tag2"));
  await assertSucceeds(db_owner.updateTimeMultipl(line1add.id, 60));

  const afterUpdate = await assertSucceeds(db_owner.getLineDoc(line1add.id));
  expect(afterUpdate.data()?.disp_name).toBe("LINE1N");
  expect(afterUpdate.data()?.tag_list.length).toBe(2);
  expect(afterUpdate.data()?.time_multipl).toBe(60);

  await assertSucceeds(db_owner.removeTagsToLineDoc(line1add.id, "tag0", "tag2"));
  const afterRemoveTags = await assertSucceeds(db_owner.getLineDoc(line1add.id));
  expect(afterRemoveTags.data()?.tag_list.length).toBe(1);
  expect(afterRemoveTags.data()?.tag_list[0]).toBe("tag1");
}));