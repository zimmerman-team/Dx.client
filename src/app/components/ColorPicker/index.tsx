import React from "react";

import { ColorService, IColor } from "./services/color";
import { Saturation } from "./components/saturation";
import { Hue } from "./components/hue";
import { Alpha } from "./components/alpha";

import { ColorPickerWrapper } from "./styles";
import { ColorInput, OpacityInput, SelectColorType } from "./components/fields";
import { useLocalStorage } from "react-use";
import ResetIcon from "./assets/reset-icon";
import Tabs from "./components/tabs";
const swatches = [
  {
    label: "DataXplorer default",
    value: ["#6061E5", "#73D3CD", "#F6C445", "#E492BD", "#E75656"],
  },
  {
    label: "Sunset coast",
    value: ["#05405B", "#58528C", "#BB5390", "#FD6565", "#FDA529"],
  },
  {
    label: "Nordic Aurora",
    value: ["#175A5C", "#23768C", "#5291BC", "#94A8E4", "#E0BAFD"],
  },
  {
    label: "Warm tone",
    value: ["#5B0C0E", "#8A3C49", "#B26E87", "#D3A4C5", "#F5DCFE"],
  },
  {
    label: "Sprint forest",
    value: ["#2B5B16", "#538137", "#7BA95A", "#A4D37E", "#D0FEA3"],
  },
  {
    label: "Purple Gradient",
    value: ["#231D2C", "#655579", "#B194D1", "#DAB5FF", "#DADAF8"],
  },
  {
    label: "Grey Gradient",
    value: ["#373D43", "#70777E", "#98A1AA", "#CFD4DA", "#F1F3F5"],
  },
];

interface IColorPickerProps {
  readonly height?: number;
  readonly color: IColor;
  readonly disabled?: boolean;
  readonly onChange: (color: IColor) => void;
  readonly onChangeComplete?: (color: IColor) => void;
}

export const ColorPicker = ({
  height = 105,
  color,
  disabled = false,
  onChange: onChangeColor,
  onChangeComplete,
}: IColorPickerProps) => {
  const [colorType, setColorType] = React.useState("hex");
  const [recentlyUsedColors, setRecentlyUsedColors] = useLocalStorage(
    "recentlyUsedColors",
    [] as string[]
  );

  const onChange = React.useCallback(
    (color: IColor) => {
      onChangeColor(color);
      const newColors = [color.hex, ...(recentlyUsedColors ?? [])];
      setRecentlyUsedColors(Array.from(new Set(newColors)).slice(0, 9));
    },
    [onChangeColor, color]
  );
  const [activeTab, setActiveTab] = React.useState("color");
  return (
    <ColorPickerWrapper>
      <div className="rcp">
        <Tabs
          activeTab={activeTab}
          tabs={[
            {
              value: "color",
              label: "Color Picker",
            },
            {
              value: "swatches",
              label: "Swatches",
            },
          ]}
          handleSwitch={setActiveTab}
        />
        {activeTab === "swatches" ? (
          <section
            css={`
              display: flex;
              flex-direction: column;
              gap: 5px;
            `}
          >
            {swatches.map((swatch) => (
              <div
                key={swatch.label}
                css={`
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                `}
              >
                <p
                  css={`
                    margin: 0;
                    font-size: 12px;
                    font-family: "GothamNarrow-Book", sans-serif;
                    font-weight: 325;
                    color: #231d2c;
                    line-height: normal;
                  `}
                >
                  {swatch.label}
                </p>
                <div
                  css={`
                    display: flex;
                    gap: 5px;
                  `}
                >
                  {swatch.value.map((c) => (
                    <div
                      key={c}
                      className="rcp-recently-used-color"
                      css={`
                        background-color: ${c};
                        border: ${c === color.hex
                          ? "2px solid #0026FF"
                          : "none"};
                      `}
                      onClick={() => {
                        onChange(ColorService.convert("hex", c));
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </section>
        ) : (
          <section className="rcp-section">
            <Saturation
              height={height}
              color={color}
              disabled={disabled}
              onChange={onChange}
              onChangeComplete={onChangeComplete}
            />
            <div className="rcp-body">
              <section className="rcp-section">
                <Hue
                  color={color}
                  disabled={disabled}
                  onChange={onChange}
                  onChangeComplete={onChangeComplete}
                />

                <Alpha
                  color={color}
                  disabled={disabled}
                  onChange={onChange}
                  onChangeComplete={onChangeComplete}
                />

                <div className="rcp-input-section">
                  <div
                    className="rcp-sample-circle"
                    css={`
                      background-color: ${color.hex};
                    `}
                  />

                  <SelectColorType
                    value={colorType}
                    onChange={setColorType}
                    options={["hex", "rgb"]}
                  />

                  <ColorInput
                    onChange={onChange}
                    color={color}
                    colorType={colorType}
                  />
                  <OpacityInput onChange={onChange} color={color} />
                </div>

                <div>
                  <p
                    css={`
                      margin: 0;
                      font-size: 12px;
                      font-family: "GothamNarrow-Bold", sans-serif;
                      font-weight: 400;
                      color: #373d43;
                      line-height: normal;
                    `}
                  >
                    Recently Used
                  </p>
                  <div
                    css={`
                      margin-top: 8px;
                      display: flex;
                      gap: 4px;
                    `}
                  >
                    {recentlyUsedColors?.map((c) => (
                      <div
                        key={c}
                        className="rcp-recently-used-color"
                        css={`
                          background-color: ${c};
                        `}
                        onClick={() => {
                          onChange(ColorService.convert("hex", c));
                        }}
                      />
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </section>
        )}
        <div
          css={`
            padding: 0 16px;
          `}
        >
          <div
            css={`
              padding: 7px 0;
              border-top: 1px solid #cfd4da;
              display: flex;
              justify-content: space-between;
              align-items: center;
            `}
          >
            <span
              css={`
                margin: 0;
                font-size: 12px;
                font-family: "GothamNarrow-Book", sans-serif;
                font-weight: 325;
                line-height: normal;
              `}
            >
              Reset
            </span>
            <ResetIcon />
          </div>
        </div>
      </div>
    </ColorPickerWrapper>
  );
};
