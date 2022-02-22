import {
  initializeTestEnvironment,
  RulesTestEnvironment,
  TestEnvironmentConfig,
} from "@firebase/rules-unit-testing";
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
export function testRunner(
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

