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

/** 時刻表データのデータ構造 */
interface _ITimetableDocument<TDate> {
  /** 任意に設定できるタグの配列 (順不同) */
  tags: string[],

  /** 列車番号 */
  train_id: string,

  /** 保安装置に設定する列車番号 */
  sec_sys_train_id: string,

  /** 初期状態で通過設定を行うかどうか */
  sec_sys_sta_pass_setting: boolean,


  /** 始発駅での無線番号 */
  radio_ch: string,

  /** 始発駅での線の色 (東芝型モニタにおける「種別」と「行先」の間にあるスペースの色) [RRGGBB] */
  line_color: string,

  /** 始発駅での列車種別 */
  train_type: string,

  /** 乗務開始駅の駅名 */
  dep_from_name: string,

  /** 乗務開始駅の発車時刻 */
  dep_from_time: TDate,

  /** 乗務開始駅での番線 */
  dep_from_track_num: string,

  /** 乗務終了液の駅名 */
  work_to_name: string,

  /** 乗務終了駅の到着時刻 */
  work_to_time: TDate,

  /** 乗務終了駅の到着番線 */
  work_to_track_num: string,

  /** 列車の終着駅の駅名 */
  last_stop_name: string,

  /** 列車の終着駅の到着時刻 */
  last_stop_time: TDate,

  /** 列車の終着駅の到着番線 */
  last_stop_track_num: string,

  /** 所属する乗務員区所 */
  office_name: string,

  /** 行路番号 */
  work_number: string,

  /** ダイヤ発効日 */
  effected_date: TDate,

  /** 付帯情報 */
  additional_info: string,

  /** 次の乗務 */
  next_work: DocumentReference<_ITimetableDocument<TDate>> | null
};

/** 時刻表データのデータ構造 */
export type TTimetableDocument = _ITimetableDocument<Date>;
/** 時刻表データのデータ構造 (サーバーサイド用) */
export type TServerSideTimetableDocument = _ITimetableDocument<Timestamp>;

interface _ITimetableRowDocument<TDate> {



  /** 前の採時駅からこの駅までの所要時間 (「0」で非表示) */
  required_time_to_this_sta: number,
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
  sta_color: string
};

/** 駅情報データのデータ構造 */
export type TTimetableRowDocument = _ITimetableRowDocument<Date>;
/** 駅情報データのデータ構造 (サーバーサイド用) */
export type TServerSideTimetableRowDocument = _ITimetableRowDocument<Timestamp>;

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
