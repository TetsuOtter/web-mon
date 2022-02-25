export const WestMON = () =>
{
  const diff_y = 3;
  const diff_x = (5 * diff_y) / 23;

  return (
    <div style={{ textAlign: "center", background: "#111" }}>
      <svg width="99.7vw" height="99.7vh" viewBox="0 0 800 600">
        <rect x="0" y="0" height="600" width="800" fill="black"/>

        <rect x="0" y="0" height="42" width="800" fill="white"/>

        {/* PageName */}
        <rect x="1" y="1" height="40" width="199" fill="blue"/>

        {/* TrainNumber */}
        <rect x="201" y="1" height="40" width="139" fill="blue"/>

        {/* TrainType / Dst. */}
        <rect x="341" y="1" height="40" width="239" fill="blue"/>

        {/* Color */}
        <path d="M 450,0 l 26,0 -10,42 -26,0 z" fill="white"/>
        <path d="M 451,1 l 24,0 -10,40 -24,0 z" fill="red"/>

        {/* Time */}
        <rect x="581" y="1" height="40" width="218" fill="blue"/>

        {/* Bottom Line */}
        <rect x="0" y="568" height="2" width="800" fill="white"/>

        {/* Bottom Tabs */}
        <path d="M -1,570 l 82,0 -5,24 -10,6 -52,0 -10,-6 -5,-24 z" fill="white" />
        <path d="M 1,570 l 78,0 -5,23 -9,5 -50,0 -9,-5 -5,-23 z" fill="blue" />

        <path d="M 79,570 l 82,0 -5,24 -10,6 -52,0 -10,-6 -5,-24 z" fill="white" />
        <path d={`M 81,${570 - diff_y} m -${diff_x},0 l ${diff_x},0 78,0 ${diff_x},0 -${diff_x},${diff_y} -5,23 -9,5 -50,0 -9,-5 -5,-23 z`} fill="black" />

        <path d="M 159,570 l 82,0 -5,24 -10,6 -52,0 -10,-6 -5,-24 z" fill="white" />
        <path d="M 161,570 l 78,0 -5,23 -9,5 -50,0 -9,-5 -5,-23 z" fill="blue" />
        <path d="M 239,570 l 82,0 -5,24 -10,6 -52,0 -10,-6 -5,-24 z" fill="white" />
        <path d="M 241,570 l 78,0 -5,23 -9,5 -50,0 -9,-5 -5,-23 z" fill="blue" />
        <path d="M 319,570 l 82,0 -5,24 -10,6 -52,0 -10,-6 -5,-24 z" fill="white" />
        <path d="M 321,570 l 78,0 -5,23 -9,5 -50,0 -9,-5 -5,-23 z" fill="blue" />
        <path d="M 399,570 l 82,0 -5,24 -10,6 -52,0 -10,-6 -5,-24 z" fill="white" />
        <path d="M 401,570 l 78,0 -5,23 -9,5 -50,0 -9,-5 -5,-23 z" fill="blue" />
        <path d="M 479,570 l 82,0 -5,24 -10,6 -52,0 -10,-6 -5,-24 z" fill="white" />
        <path d="M 481,570 l 78,0 -5,23 -9,5 -50,0 -9,-5 -5,-23 z" fill="blue" />
        <path d="M 559,570 l 82,0 -5,24 -10,6 -52,0 -10,-6 -5,-24 z" fill="white" />
        <path d="M 561,570 l 78,0 -5,23 -9,5 -50,0 -9,-5 -5,-23 z" fill="blue" />
        <path d="M 639,570 l 82,0 -5,24 -10,6 -52,0 -10,-6 -5,-24 z" fill="white" />
        <path d="M 641,570 l 78,0 -5,23 -9,5 -50,0 -9,-5 -5,-23 z" fill="blue" />
        <path d="M 719,570 l 82,0 -5,24 -10,6 -52,0 -10,-6 -5,-24 z" fill="white" />
        <path d="M 721,570 l 78,0 -5,23 -9,5 -50,0 -9,-5 -5,-23 z" fill="blue" />

        <svg x="40px" y="0" height="36px" width="120px">
          <text y="32px" fill="white" fontSize="32px" transform="scale(0.5,1)">運転士</text>
        </svg>
        <svg x="200px" y="0" height="36px" width="200px">
          <text y="32px" x="250px" text-anchor="end" fill="white" fontSize="32px" transform="scale(0.5,1)">試９９９９Ａ</text>
        </svg>
      </svg>
    </div>
  );
}