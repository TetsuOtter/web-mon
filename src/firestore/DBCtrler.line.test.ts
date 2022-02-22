import {
  assertFails,
  assertSucceeds,
} from "@firebase/rules-unit-testing";
import { DBCtrler } from "./DBCtrler";
import { TLineDocument } from "./DBCtrler.types";
import { testRunner } from "./DBCtrler.test";

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
