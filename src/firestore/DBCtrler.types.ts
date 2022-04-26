import { DocumentReference, Timestamp } from "firebase/firestore";

export type TFirestoreDictionary<TData> = { [key: string]: TData; };

/** 路線データのデータ構造 */
interface _ILineDocument<TMap> {
  /**
   * 読み込み可能なユーザの一覧
   * emptyは全ユーザにマッチする = 全ユーザに読み込み権限を与える
   * 常に1つ以上のユーザIDが書き込まれている (Emptyを含む)
   */
  can_read: string[],

  /**
   * 書き込み可能なユーザの一覧
   * emptyは全ユーザにマッチする = 全ユーザに書き込み権限を与える
   * 常に1つ以上のユーザIDが書き込まれている (Emptyを含む)
   */
  can_write: string[],

  /** 路線の表示名 */
  disp_name: string,

  /** 列車情報で使用されているタグの一覧 (順不同) */
  tag_list: string[],

  /** READ権限付与に使用できるハッシュ化パスワードの一覧 (key: ハッシュ化パスワード / value: 有効期限) */
  hashed_read_pw: TMap,

  /** WRITE権限付与に使用できるハッシュ化パスワードの一覧 (key: ハッシュ化パスワード / value: 有効期限) */
  hashed_write_pw: TMap,

  /**
   * 時間の加速具合 (通常は「1」を指定する)
   * 模型の運転会等で使用する場合は, 「30」や「60」を指定する
   */
  time_multipl: number
};

/** 路線データのデータ構造 */
export type TLineDocument = _ILineDocument<Map<string, Date>>;
/** 路線データのデータ構造 (サーバーサイド用) */
export type TServerSideLineDocument = _ILineDocument<TFirestoreDictionary<Timestamp>>;

/** ABC共通 行路情報 */
interface _IWorkCourceDocument<TDate> {
  /** 所属する乗務員区所 */
  office_name: string,

  /** 行路番号 */
  work_number: string,

  /** ダイヤ発効日 */
  effected_date: TDate,
};

/** 開始と終了が指定された任意の情報を格納するオブジェクト */
interface ITextWithFromUntilInfo {
  /** テキスト */
  text: string,

  /** 開始地点情報 */
  from_info: string,

  /** 終了地点情報 */
  to_info: string,
}

/** 行路中の特殊なアクションについて */
interface IActionInWork {
  /** アクションの種類 */
  type: string,

  /** アクションの開始地点 (Locationに対応する) */
  from: number,

  /** アクションの終了地点 (Locationに対応する) */
  to: number,

  /** アクションに必要な情報 */
  data: string,
}

/** BC運用 各列車の情報 */
interface _IBCWorkEachTrainDocument<TDate> {
  /** 乗務する列車 */
  train: DocumentReference<_IAWorkEachTrainDocument<TDate>>,

  /** 乗務開始駅発車時刻について、初日00:00からの経過時間[分] */
  work_from_time: number,

  /** 乗務開始駅 */
  work_from: DocumentReference<_ITimetableRowDocument>,

  /** 乗務終了駅 */
  work_to: DocumentReference<_ITimetableRowDocument>,

  /** 便乗かどうか */
  to_move: boolean,

  /** 始発駅での線の色 (東芝型モニタにおける「種別」と「行先」の間にあるスペースの色) [RRGGBB] */
  line_color: string,

  /** 始発駅での列車種別 */
  train_type: string,

  /** 最高速度 */
  max_speed: ITextWithFromUntilInfo[],

  /** 速度種別 */
  speed_type: ITextWithFromUntilInfo[],

  /** けん引定数 */
  hauling_capacity_of_engine: string,

  /** 付帯情報 */
  additional_info: string,
};

/** A運用 各列車の情報 */
interface _IAWorkEachTrainDocument<TDate> {
  /** 列車番号 */
  train_id: string,

  /** 保安装置に設定する列車番号 */
  sec_sys_train_id: string,

  /** E電かどうか */
  is_e_train: boolean,

  /** 始発駅発車時刻について、初日00:00からの経過時間[分] */
  work_from_time: number,

  /** 編成両数 */
  car_count: number,

  /** 始発駅 */
  work_from: DocumentReference<_ITimetableRowDocument>,

  /** 終着駅 */
  work_to: DocumentReference<_ITimetableRowDocument>,
};

interface _ITimetableRowDocument {
  /** 駅名 */
  station: DocumentReference<TStationDocument>,

  /** 到着時刻 (0時からの経過秒数) */
  arrive_time: number | null,

  /** 発車/通過時刻 (0時からの経過秒数) */
  departure_time: number | null,

  /** 通過駅かどうか */
  is_pass: boolean,

  /** 通過禁止駅かどうか */
  no_pass: boolean,

  /** 運転停車かどうか */
  is_stop_to_work: boolean,

  /** 到着/発車番線 */
  track: DocumentReference<TTrackDocument>,

  /** 進入制限速度 [km/h] */
  run_in_limit: number,

  /** 進出制限速度 [km/h] */
  run_out_limit: number,

  /** 駅仕業 */
  sta_work: string,

  /** 駅の色 */
  sta_color: string,

  /** 記事 */
  note: string,
};

/** 駅情報データのデータ構造 */
export type TTimetableRowDocument = _ITimetableRowDocument;
/** 駅情報データのデータ構造 (サーバーサイド用) */
export type TServerSideTimetableRowDocument = _ITimetableRowDocument;

interface _TStationDocument {
  /** 駅名(省略なし) */
  full_name: string,

  /** 4文字での駅名 */
  name_len_4: string,

  /** 駅位置 */
  location: number,
};

/** 駅情報データのデータ構造 */
export type TStationDocument = _TStationDocument;
/** 駅情報データのデータ構造 (サーバーサイド用) */
export type TServerSideStationDocument = _TStationDocument;

interface _TTrackDocument {
  /** 番線名 (省略なし) */
  full_name: string,

  /** 番線名 (表示名 空白でfull_nameを表示) */
  disp_name: string,
};

/** 番線データのデータ構造 */
export type TTrackDocument = _TTrackDocument;
/** 番線データのデータ構造 (サーバーサイド用) */
export type TServerSideTrackDocument = _TTrackDocument;
