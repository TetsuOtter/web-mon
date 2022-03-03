export const Header = () =>
{
  return (
    <svg>
      <rect x="0" y="0" height="63" width="800" fill="white" />

      {/* PageName */}
      <rect x="1" y="1" height="40" width="199" fill="blue" />

      {/* TrainNumber */}
      <rect x="201" y="1" height="40" width="159" fill="blue" />

      {/* TrainType / Dst. */}
      <rect x="361" y="1" height="40" width="239" fill="blue" />

      {/* Color */}
      <path d="M 470,0 l 26,0 -10,42 -26,0 z" fill="white" />
      <path d="M 471,1 l 24,0 -10,40 -24,0 z" fill="red" />

      {/* Time */}
      <rect x="601" y="1" height="40" width="198" fill="blue" />

      <rect x="1" y="43" height="18" width="199" fill="black" />
      <rect x="201" y="43" height="18" width="99" fill="black" />
      <rect x="301" y="43" height="18" width="99" fill="black" />
      <rect x="401" y="43" height="18" width="99" fill="black" />
      <rect x="501" y="43" height="18" width="99" fill="black" />
      <rect x="601" y="43" height="18" width="99" fill="black" />
      <rect x="701" y="43" height="18" width="98" fill="black" />

      <svg x="40px" y="0" height="36px" width="120px">
        <text y="32px" fill="white" fontSize="32px" transform="scale(0.5,1)">メニュー</text>
      </svg>
      <svg x="200px" y="0" height="36px" width="200px">
        <text y="32px" x="250px" textAnchor="end" fill="white" fontSize="32px" transform="scale(0.5,1)">試９９９９Ａ</text>
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
    </svg>
  );
}