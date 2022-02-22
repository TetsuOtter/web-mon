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

test("LineData: Invalid Elements DataType Error Test", testRunner(async (env) => {
  const owner_id = "test_user_id";
  const ctx_owner = env.authenticatedContext(owner_id);

  const db_owner = new DBCtrler(ctx_owner.firestore());

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

  const db_owner = new DBCtrler(ctx_owner.firestore());

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

