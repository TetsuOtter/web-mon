import { BottomButton } from "../components/west-mon/BottomButton";
import { Timetable } from "../components/west-mon/Timetable";
import { Header } from "../components/west-mon/Header";
import { CarImage } from "../components/west-mon/CarImage";
import { DeviceStateBox } from "../components/west-mon/DeviceStateBox";

export const WestMON = () =>
{
  // turn off anti-aliasing ref: https://qiita.com/ttwwiitttteerr0/items/867c45e420839cd7f1dc
  return (
    <div style={{ background: "#111", fontFamily: "JF-Dot-jiskan16s", shapeRendering: "crispEdges" }}>
      <svg width="99.7vw" height="99.7vh" viewBox="0 0 800 600">
        <rect x="0" y="0" height="600" width="800" fill="black" />

        <Header />

        <CarImage
          x="155"
          y="72"
          width={40}
          isDriversCar={true}
          isLeftSideHEAD={true}
          isRightPanAvailable={true}
          isRightPanUp={true}
          carDescriptionChars="Mc"
          carNumber={3}
          isRightBogieLeftWheelMotored={true}
          isRightBogieRightWheelMotored={true}
        />
        <CarImage
          x="195"
          y="72"
          width={40}
          isRightSideHEAD={true}
          carDescriptionChars="M'c"
          carNumber={2}
          isLeftBogieLeftWheelMotored={true}
          isLeftBogieRightWheelMotored={true}
        />
        <CarImage
          x="235"
          y="72"
          width={60}
          isLeftSideHEAD={true}
          isRightSideHEAD={true}
          carDescriptionChars="Mc"
          carNumber={1}
          isLeftPanAvailable={true}
          isRightPanAvailable={true}
          isLeftPanUp={false}
          isRightPanUp={true}
          isLeftBogieLeftWheelMotored={true}
          isLeftBogieRightWheelMotored={true}
        />

        <svg x="12px" y="144" height="36px" width="120px">
          <text y="32px" fill="white" fontSize="16px" transform="scale(2,1)">ζΈγι</text>
        </svg>

        <DeviceStateBox
          x="155"
          y="160"
          text="ι"
          stroke="white"
        />
        <DeviceStateBox
          x="195"
          y="160"
          text="ι"
          stroke="white"
          fill="red"
        />
        <DeviceStateBox
          x="245"
          y="160"
          text="ι"
          stroke="white"
        />

        {/* Bottom Line */}
        <rect x="0" y="568" height="2" width="800" fill="white" />

        {/* Bottom Tabs */}
        <BottomButton x="0" text="ζ¬‘η»ι’" />
        <BottomButton x="80" visibility="hidden" />
        <BottomButton x="160" text="ζ©ε¨ιζΎ" />
        <BottomButton x="240" text="γ―γ³γγ³" />
        <BottomButton x="320" text="θ»δΈ‘ηΆζ" />
        <BottomButton x="400" text="ATSθ¨­ε?" />
        <BottomButton x="480" text="εΏζ₯οΎοΎο½­ο½±" />
        <BottomButton x="560" text="ζε»θ‘¨" />
        <BottomButton x="640" text="ιθ»’ζε ±" isSelected />
        <BottomButton x="720" text="γ‘γγ₯γΌ" />

        <Timetable />
      </svg>
    </div>
  );
}