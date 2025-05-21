//ts-ignore
import { hsvToHex, hsvToRgb, rgbToHex, hexToRgb } from "app/utils/hsvtohex";
import { set } from "lodash";
import React, { useState, useEffect } from "react";
import { ColorResult, CustomPicker } from "react-color";
import { Alpha, Hue, Saturation } from "react-color/lib/components/common";
import styled from "styled-components";

// Styled components
const PickerContainer = styled.div`
  width: 400px;
  background-color: #f5f5f7;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 16px;
`;

const Tab = styled.div<{ $active?: boolean }>`
  flex: 1;
  text-align: center;
  padding: 8px 0;
  background-color: ${(props) => (props.$active ? "#1c1c24" : "transparent")};
  color: ${(props) => (props.$active ? "white" : "#1c1c24")};
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
`;

const SaturationContainer = styled.div`
  position: relative;
  width: 100%;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
`;

const HueContainer = styled.div`
  position: relative;
  width: 100%;
  height: 8px;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const AlphaContainer = styled.div`
  position: relative;
  width: 100%;
  height: 8px;
  border-radius: 8px;
  margin-bottom: 16px;
  background: repeating-conic-gradient(#e0e0e0 0% 25%, white 0% 50%) 0 0 / 10px
    10px;
`;

const ColorControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const ColorPreview = styled.div<{ color: string }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
`;

const InputGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const SelectContainer = styled.div`
  position: relative;
  width: 80px;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  background-color: white;
  appearance: none;
  font-weight: 600;
`;

const HexInput = styled.input`
  width: 120px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  background-color: white;
`;

const AlphaInput = styled.input`
  width: 80px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  background-color: white;
`;

const RecentlyUsedSection = styled.div`
  margin-top: 16px;
`;

const RecentlyUsedTitle = styled.div`
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
`;

const SwatchesContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const Swatch = styled.div<{ color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  cursor: pointer;
`;

const ResetButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 16px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-weight: 600;
  color: #333;
  margin-top: 16px;
`;

const Pointer = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: white;
  border: 2px solid white;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2);
  transform: translate(-8px, -8px);
`;

const AlphaPointer = styled.div<{ left: number }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: white;
  border: 2px solid white;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2);
  transform: translate(-8px, -8px);
  position: absolute;
  left: ${(props) => props.left}px;
`;
interface Props {
  colorValue: string;
  onChange: (
    color: ColorResult,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

// Custom color picker component
const CustomColorPicker = ({ onChange, colorValue }: Props) => {
  const [activeTab, setActiveTab] = useState("picker");
  const [colorFormat, setColorFormat] = useState<"hex" | "rgb">("hex");
  const [inputValue, setInputValue] = useState(colorValue);
  const [huePointerXY, setHuePointerXY] = useState({ x: 0, y: 0 });
  const [alphaPointerXY, setAlphaPointerXY] = useState({ x: 0, y: 0 });
  const [hueHSV, setHueHSV] = useState({ h: 0, s: 0, v: 0 });
  const [recentColors, setRecentColors] = useState([
    "#4361ee",
    "#1c1c24",
    "#2ec4b6",
  ]);

  const HuePointer = styled.div`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: pink;
    position: absolute;
    /* border: 2px solid white;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2);
  transform: translate(-8px, -8px); */
    left: ${huePointerXY.x}px;
    stroke-width: 2px;
    stroke: var(--white, #fff);
    filter: drop-shadow(0px 1.447px 2.894px rgba(97, 97, 97, 0.2))
      drop-shadow(0px 0.723px 1.447px rgba(97, 97, 97, 0.2));
  `;
  const handleColorChange = (
    color: ColorResult,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log(color, "color", e, "e.target.value");
    if (colorFormat === "hex") {
      const hex = hsvToHex(
        //@ts-ignore
        color.h,
        //@ts-ignore
        color.s,
        //@ts-ignore
        color.v
      );
      setInputValue(hex);
    } else {
      const rgb = hsvToRgb(
        //@ts-ignore
        color.h,
        //@ts-ignore
        color.s,
        //@ts-ignore
        color.v
      );

      setInputValue(`${rgb.r} | ${rgb.g} | ${rgb.b}`);
    }
    onChange(color, e);
  };
  const handleHuePointerUpdate = (
    color: ColorResult,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setHueHSV({
      //@ts-ignore
      h: color.h,
      //@ts-ignore
      s: color.s,
      //@ts-ignore
      v: color.v,
    });
    const container = e.currentTarget.getBoundingClientRect();
    //@ts-ignore
    const relativeX = e.clientX - container.left;

    // Clamp the X value within the container's width
    const clampedX = Math.max(0, Math.min(relativeX, container.width));

    setHuePointerXY({ x: clampedX, y: 0 }); // Y is usually fixed for horizontal hue
  };

  const handleAlphaPointerUpdate = (
    color: ColorResult,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const container = e.currentTarget.getBoundingClientRect();
    //@ts-ignore
    const relativeX = e.clientX - container.left;

    // Clamp the X value within the container's width
    const clampedX = Math.max(0, Math.min(relativeX, container.width));

    setAlphaPointerXY({ x: clampedX, y: 0 }); // Y is usually fixed for horizontal hue
  };
  const handleToggleColorFormatChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedFormat = e.target.value as "hex" | "rgb";
    setColorFormat(selectedFormat);
    //check what type of string colorValue is
    const isHex = /^#[0-9A-F]{6}$/i.test(inputValue);
    if (selectedFormat === "hex" && !isHex) {
      const hex = rgbToHex(
        parseInt(inputValue.split("|")[0].trim()),
        parseInt(inputValue.split("|")[1].trim()),
        parseInt(inputValue.split("|")[2].trim())
      );
      console.log(hex, "hex");
      setInputValue(hex);
    } else if (selectedFormat === "rgb" && isHex) {
      const rgb = hexToRgb(colorValue);
      setInputValue(`${rgb.r} | ${rgb.g} | ${rgb.b}`);
    }
  };

  console.log(inputValue, "inputValue");

  return (
    <PickerContainer>
      <TabContainer>
        <Tab
          $active={activeTab === "picker"}
          onClick={() => setActiveTab("picker")}
        >
          Color Picker
        </Tab>
        <Tab
          $active={activeTab === "swatches"}
          onClick={() => setActiveTab("swatches")}
        >
          Swatches
        </Tab>
      </TabContainer>

      <SaturationContainer>
        <Saturation
          //   color={{ h: 0, s: 0, l: 0 }}
          onChange={handleColorChange}
          pointer={() => <Pointer />}
          //@ts-ignore
          hsv={{ h: hueHSV.h, s: hueHSV.s, v: hueHSV.v }}
          hsl={{ h: hueHSV.h, s: hueHSV.s, l: hueHSV.v }}
          hex={""}
        />
      </SaturationContainer>

      <HueContainer>
        <Hue
          color={{ h: 0, s: 0, l: 0 }}
          onChange={handleHuePointerUpdate}
          pointer={() => <HuePointer />}
          //@ts-ignore
          hsl={{ h: 0, s: 0, l: 0 }}
        />
      </HueContainer>

      <AlphaContainer>
        <Alpha
          color={{ h: hueHSV.h, s: hueHSV.s, l: hueHSV.v }}
          onChange={handleAlphaPointerUpdate}
          pointer={() => <AlphaPointer left={alphaPointerXY.x} />}
          //@ts-ignore
          hsl={{ h: hueHSV.h, s: hueHSV.s, l: hueHSV.v }}
          rgb={{ r: 0, g: 0, b: 0 }}
        />
      </AlphaContainer>

      <ColorControls>
        <ColorPreview
          color={
            colorFormat === "hex"
              ? inputValue
              : `rgb(${inputValue.split("|")[0].trim()}, ${inputValue
                  .split("|")[1]
                  .trim()}, ${inputValue.split("|")[2].trim()})`
          }
        />
        <InputGroup>
          <SelectContainer>
            <Select onChange={handleToggleColorFormatChange}>
              <option value="hex">HEX</option>
              <option value="rgb">RGB</option>
            </Select>
          </SelectContainer>
          <HexInput value={inputValue} />
          <AlphaInput value={`${100}%`} readOnly />
        </InputGroup>
      </ColorControls>

      <RecentlyUsedSection>
        <RecentlyUsedTitle>Recently Used</RecentlyUsedTitle>
        <SwatchesContainer>
          {recentColors.map((color, index) => (
            <Swatch key={index} color={color} onClick={(e) => {}} />
          ))}
        </SwatchesContainer>
      </RecentlyUsedSection>

      <ResetButton onClick={() => {}}>
        <span>Reset</span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask
            id="mask0_25555_12885"
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="18"
            height="18"
          >
            <rect width="18" height="18" fill="#D9D9D9" />
          </mask>
          <g mask="url(#mask0_25555_12885)">
            <path
              d="M9 15.75C7.275 15.75 5.77188 15.1781 4.49063 14.0344C3.20938 12.8906 2.475 11.4625 2.2875 9.75H3.825C4 11.05 4.57813 12.125 5.55938 12.975C6.54063 13.825 7.6875 14.25 9 14.25C10.4625 14.25 11.7031 13.7406 12.7219 12.7219C13.7406 11.7031 14.25 10.4625 14.25 9C14.25 7.5375 13.7406 6.29688 12.7219 5.27813C11.7031 4.25938 10.4625 3.75 9 3.75C8.1375 3.75 7.33125 3.95 6.58125 4.35C5.83125 4.75 5.2 5.3 4.6875 6H6.75V7.5H2.25V3H3.75V4.7625C4.3875 3.9625 5.16563 3.34375 6.08438 2.90625C7.00313 2.46875 7.975 2.25 9 2.25C9.9375 2.25 10.8156 2.42813 11.6344 2.78438C12.4531 3.14063 13.1656 3.62188 13.7719 4.22813C14.3781 4.83438 14.8594 5.54688 15.2156 6.36563C15.5719 7.18438 15.75 8.0625 15.75 9C15.75 9.9375 15.5719 10.8156 15.2156 11.6344C14.8594 12.4531 14.3781 13.1656 13.7719 13.7719C13.1656 14.3781 12.4531 14.8594 11.6344 15.2156C10.8156 15.5719 9.9375 15.75 9 15.75Z"
              fill="#231D2C"
            />
          </g>
        </svg>
      </ResetButton>
    </PickerContainer>
  );
};

export default CustomPicker(CustomColorPicker);
