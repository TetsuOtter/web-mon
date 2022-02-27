import { BottomButton } from "./west-mon/BottomButton";

export const WestMON = () =>
{
  const diff_y = 3;
  const diff_x = (5 * diff_y) / 23;

  return (
    <div style={{ textAlign: "center", background: "#111", fontFamily: "JF-Dot-jiskan16s" }}>
      <svg width="99.7vw" height="99.7vh" viewBox="0 0 800 600">
        <rect x="0" y="0" height="600" width="800" fill="black"/>

        <rect x="0" y="0" height="63" width="800" fill="white"/>

        {/* PageName */}
        <rect x="1" y="1" height="40" width="199" fill="blue"/>

        {/* TrainNumber */}
        <rect x="201" y="1" height="40" width="159" fill="blue"/>

        {/* TrainType / Dst. */}
        <rect x="361" y="1" height="40" width="239" fill="blue"/>

        {/* Color */}
        <path d="M 470,0 l 26,0 -10,42 -26,0 z" fill="white"/>
        <path d="M 471,1 l 24,0 -10,40 -24,0 z" fill="red"/>

        {/* Time */}
        <rect x="601" y="1" height="40" width="218" fill="blue"/>

        <rect x="1" y="43" height="18" width="199" fill="black"/>
        <rect x="201" y="43" height="18" width="99" fill="black"/>
        <rect x="301" y="43" height="18" width="99" fill="black"/>
        <rect x="401" y="43" height="18" width="99" fill="black"/>
        <rect x="501" y="43" height="18" width="99" fill="black"/>
        <rect x="601" y="43" height="18" width="99" fill="black"/>
        <rect x="701" y="43" height="18" width="98" fill="black"/>


        {/* Bottom Line */}
        <rect x="0" y="568" height="2" width="800" fill="white"/>

        {/* Bottom Tabs */}
        <BottomButton x="0" text="次画面"/>
        <BottomButton x="80" visibility="hidden"/>
        <BottomButton x="160" text="機器開放"/>
        <BottomButton x="240" text="ワンマン"/>
        <BottomButton x="320" text="車両状態"/>
        <BottomButton x="400" text="ATS設定"/>
        <BottomButton x="480" text="応急ﾏﾆｭｱ"/>
        <BottomButton x="560" text="時刻表"/>
        <BottomButton x="640" text="運転情報" isSelected/>
        <BottomButton x="720" text="メニュー"/>

        <svg x="40px" y="0" height="36px" width="120px">
          <text y="32px" fill="white" fontSize="32px" transform="scale(0.5,1)">メニュー</text>
        </svg>
        <svg x="200px" y="0" height="36px" width="200px">
          <text y="32px" x="250px" text-anchor="end" fill="white" fontSize="32px" transform="scale(0.5,1)">試９９９９Ａ</text>
        </svg>
        <svg x="370px" y="0" height="36px" width="120px">
          <text y="32px" fill="white" fontSize="32px" transform="scale(0.5,1)">雪丸普通</text>
        </svg>
        <svg x="500px" y="0" height="36px" width="120px">
          <text y="32px" fill="white" fontSize="32px" transform="scale(0.5,1)">王寺（高</text>
        </svg>
        <svg x="710px" y="0" height="36px" width="80px">
          <text y="32px" fill="white" fontSize="32px" transform="scale(0.5,1)">２３：５９</text>
        </svg>

        <rect x="40" y="200" height="288" width="720" stroke="white" strokeWidth="1px"/>
        <svg x="40" y="200">
          <rect x="0" height="36" width="720" stroke="white" strokeWidth="1px" fill="blue" />

          <rect x="0" width="72" height="288" stroke="white" strokeWidth="1px" fill="none" />
          <rect x="72" width="180" height="288" stroke="white" strokeWidth="1px" fill="none"/>
          <rect x="252" width="54" height="288" stroke="white" strokeWidth="1px" fill="none"/>
          <rect x="306" width="126" height="288" stroke="white" strokeWidth="1px" fill="none"/>
          <rect x="432" width="126" height="288" stroke="white" strokeWidth="1px" fill="none"/>
          <rect x="558" width="54" height="288" stroke="white" strokeWidth="1px" fill="none"/>
          <rect x="612" width="108" height="288" stroke="white" strokeWidth="1px" fill="none"/>
          <rect x="612" width="54" y="18" height="270" stroke="white" strokeWidth="1px" fill="none" />
          <rect x="666" width="54" y="18" height="270" stroke="white" strokeWidth="1px" fill="none" />

          <text y="18" x="36" text-anchor="middle" dominant-baseline="central" fill="white" fontSize="16px">時分</text>
          <text y="18" x="162" text-anchor="middle" dominant-baseline="central" fill="white" fontSize="16px">停車場名</text>
          <text y="18" x="279" text-anchor="middle" dominant-baseline="central" fill="white" fontSize="16px">着発線</text>
          <text y="18" x="369" text-anchor="middle" dominant-baseline="central" fill="white" fontSize="16px">着時刻</text>
          <text y="18" x="495" text-anchor="middle" dominant-baseline="central" fill="white" fontSize="16px">発時刻</text>
          <text y="18" x="585" text-anchor="middle" dominant-baseline="central" fill="white" fontSize="16px">線路</text>
          <text y="9" x="666" text-anchor="middle" dominant-baseline="central" fill="white" fontSize="16px">制限速度</text>
          <text y="27" x="639" text-anchor="middle" dominant-baseline="central" fill="white" fontSize="16px">進入</text>
          <text y="27" x="693" text-anchor="middle" dominant-baseline="central" fill="white" fontSize="16px">進出</text>

          <svg x="0" y="36" height="36" width="720">
            <rect height="100%" width="100%" fill="#222"/>
            <text y="16" x="48" height="18" width="48" text-anchor="end" fill="white" fontSize="16px" transform="scale(1,2)">１</text>
            <text y="32" x="48" height="18" width="16" text-anchor="start" fill="white" fontSize="16px" >30</text>
            <svg x="88">
              <text y="18" fill="white" fontSize="16px" transform="scale(2,1)">羽横国大</text>
            </svg>
            <text y="18" x="254" width="54" fill="white" fontSize="16px" >２</text>

            <svg x="306" width="126">
              <text y="18" x="36" width="32" textAnchor="end" fill="white" fontSize="16px" >・</text>
              <text y="18" x="36" width="16" fill="white" fontSize="16px" >・</text>
              <text y="18" x="52" width="32" fill="white" fontSize="16px" >・</text>
              <text y="18" x="84" width="16" fill="white" fontSize="16px" ></text>
              <text y="18" x="100" width="16" fill="white" fontSize="16px" ></text>
            </svg>
            <svg x="432" width="126">
              <text y="18" x="36" width="32" textAnchor="end" fill="white" fontSize="16px" >２３</text>
              <text y="18" x="36" width="16" fill="white" fontSize="16px" >：</text>
              <text y="18" x="52" width="32" fill="white" fontSize="16px" >５９</text>
              <text y="18" x="84" width="16" fill="white" fontSize="16px" >．</text>
              <text y="18" x="100" width="16" fill="white" fontSize="16px" >59</text>
            </svg>

            <text y="18" x="639" textAnchor="middle" width="54" fill="white" fontSize="16px" >２</text>
            <text y="18" x="693" textAnchor="middle" width="54" fill="white" fontSize="16px" >２</text>
          </svg>

        </svg>
      </svg>
    </div>
  );
}