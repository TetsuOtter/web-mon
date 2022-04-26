# データベース構造

```mermaid
erDiagram

line {
  string[] can_read
  string[] can_write
  string disp_name
  string[] tag_list
  Map<string,Date> hashed_read_pw
  Map<string,Date> hashed_write_pw
  number time_multipl
}

timetable {
  string[] tags
  string train_id
  string sec_sys_train_id
  boolean sec_sys_sta_pass_setting
  string radio_ch
  string line_color
  string train_type
  string dep_from_name
  Date dep_from_time
  string dep_from_track_num
  string work_to_name
  Date work_to_time
  string work_to_track_num
  string last_stop_name
  Date last_stop_time
  string last_stop_track_num
  string office_name
  sring work_number
  Date effected_date
  string additional_info
  Reference next_work
}

row {
  integer required_time_to_this_sta
  Reference station
  integer|null arrive_time
  integer|null departure_time
  boolean is_pass
  boolean no_pass
  boolean is_stop_to_work
  Reference|null track
  integer run_in_limit
  integer run_out_limit
  string sta_work
  string sta_color
}

station {
  string full_name
  string name_len_4
  number location
}

track {
  string full_name
  string disp_name
};

line |--o{ timetable: "/line/{LINE_ID}/timetables"
line |--o{ station: "/line/{LINE_ID}/stations"

timetable |--o{ row: "/line/{LINE_ID}/timetables"
timetable |--o| timetable: "timetable.next_work"

station |--o{ track: "/line/{LINE_ID}/stations/{STATION_ID}/tracks"

row |--| station: "row.station"
row |--o| track: "row.track"

```
