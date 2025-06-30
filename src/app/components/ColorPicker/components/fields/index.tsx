import React, { memo, useCallback, useEffect, useState } from "react";
import {
  ColorService,
  IColor,
} from "app/components/ColorPicker/services/color";

import ExpandSelectIcon from "app/components/ColorPicker/assets/expand-select";
import { ClickAwayListener } from "@material-ui/core";

interface ISelectColorTypeProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}
export const SelectColorType = ({
  value,
  options,
  onChange,
}: ISelectColorTypeProps) => {
  const [open, setOpen] = useState(false);
  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div
        className="rcp-input"
        css={`
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 74px;
          font-size: 12px;
          font-weight: 325;
          font-family: "GothamNarrow-Book", sans-serif;
          color: #374151;
          cursor: pointer;
        `}
        onClick={() => setOpen((prev) => !prev)}
      >
        {value.toUpperCase()} <ExpandSelectIcon />
        {open ? (
          <div
            css={`
              position: absolute;
              border-radius: 10px;
              box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.3);
              width: 100%;
              left: 0;
              top: calc(100% + 2px);
              display: flex;
              flex-direction: column;
              gap: 7px;
              padding: 7px 16px;
              background: #f1f3f5;
            `}
          >
            {options.map((option) => (
              <div
                key={option}
                css={`
                  border-bottom: 1px solid #cfd4da;
                  padding-bottom: 7px;
                  :last-of-type {
                    border-bottom: none;
                  }
                  font-size: 12px;
                  font-weight: 325;
                  font-family: "GothamNarrow-Book", sans-serif;
                  cursor: pointer;
                  color: ${value === option ? "#ADB5BD" : "#374151"};
                `}
                onClick={() => {
                  setOpen(false);
                  onChange(option);
                }}
              >
                {option.toUpperCase()}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </ClickAwayListener>
  );
};

interface IColorInputProps {
  color: IColor;
  colorType: string;
  onChange: (color: IColor) => void;
  disabled?: boolean;
}

export const ColorInput = ({
  color,
  colorType,
  onChange,
  disabled,
}: IColorInputProps) => {
  const [fields, setFields] = useState({
    hex: {
      value: color.hex,
      inputted: false,
    },
    rgb: {
      value: color.rgb,
      inputted: false,
    },
  });

  const onInputFocus = useCallback(
    <T extends keyof typeof fields>(field: T) =>
      () => {
        setFields((fields) => ({
          ...fields,
          [field]: { ...fields[field], inputted: true },
        }));
      },
    []
  );

  const onInputBlur = useCallback(
    <T extends keyof typeof fields>(field: T) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setFields((fields) => ({
          ...fields,
          [field]: { ...fields[field], inputted: false },
        }));
      },
    []
  );

  useEffect(() => {
    if (!fields.hex.inputted) {
      setFields((fields) => ({
        ...fields,
        hex: { ...fields.hex, value: color.hex },
      }));
    }
  }, [fields.hex.inputted, color.hex]);

  useEffect(() => {
    if (!fields.rgb.inputted) {
      setFields((fields) => ({
        ...fields,
        rgb: { ...fields.rgb, value: color.rgb },
      }));
    }
  }, [fields.rgb.inputted, color.rgb]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    rgbOption: string = ""
  ) => {
    const value = event.target.value;
    if (colorType === "hex") {
      const newColor = ColorService.convert("hex", value);

      setFields((fields) => ({
        ...fields,
        hex: { ...fields["hex"], value },
      }));
      onChange(newColor);
    } else {
      const newValue = parseInt(value);

      const newColor = ColorService.convert("rgb", {
        ...color.rgb,
        [rgbOption]: newValue,
      });
      setFields((fields) => ({
        ...fields,
        rgb: { ...fields["rgb"], value: newColor.rgb },
      }));

      onChange(newColor);
    }
  };

  return (
    <div
      className="rcp-input"
      css={`
        display: flex;
        align-items: center;
        width: 87px;
        height: 34px;
      `}
    >
      {colorType === "rgb" ? (
        <div
          css={`
            display: flex;
            align-items: center;
            width: 100%;
            justify-content: space-between;
          `}
        >
          {Object.entries(fields.rgb.value)
            .slice(0, -1)
            .map(([key, value], index) => (
              <React.Fragment key={key}>
                <input
                  value={value}
                  css={`
                    width: 22px;
                    font-size: 12px;
                    border: none;
                    background: transparent;
                    outline: none;
                  `}
                  disabled={disabled}
                  onFocus={onInputFocus("rgb")}
                  maxLength={3}
                  onChange={(event) => handleChange(event, key)}
                  onBlur={onInputBlur("rgb")}
                />
                {index <
                Object.keys(fields.rgb.value).slice(0, -1).length - 1 ? (
                  <span
                    css={`
                      color: #adb5bd;
                      margin: 0;
                    `}
                  >
                    |
                  </span>
                ) : null}
              </React.Fragment>
            ))}
        </div>
      ) : (
        <input
          value={`#${fields.hex.value.slice(1, 7)}`}
          css={`
            width: 100%;
            font-size: 12px;
            border: none;
            background: transparent;
            outline: none;
            height: 100%;
            text-transform: uppercase;
          `}
          disabled={disabled}
          maxLength={7}
          minLength={1}
          onChange={handleChange}
          onFocus={onInputFocus("hex")}
          onBlur={onInputBlur("hex")}
        />
      )}
    </div>
  );
};

interface OpacityInputProps {
  color: IColor;
  onChange: (color: IColor) => void;
  disabled?: boolean;
}

export const OpacityInput = ({
  color,
  onChange,
  disabled,
}: OpacityInputProps) => {
  const opacityPercent = Math.round(color.rgb.a * 100);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;

    if (value.endsWith("%")) {
      value = value.slice(0, -1);
      const newOpacity = parseFloat(value) / 100;
      const newColor = {
        ...color,
        rgb: {
          ...color.rgb,
          a: newOpacity,
        },
        hex: ColorService.rgb2hex({
          ...color.rgb,
          a: newOpacity,
        }),
        hsv: ColorService.rgb2hsv({
          ...color.rgb,
          a: newOpacity,
        }),
      };
      onChange(newColor);
    }
  };
  return (
    <div
      className="rcp-input"
      css={`
        display: flex;
        align-items: center;
        width: max-content;
        width: 60px;
        height: 34px;
      `}
    >
      <input
        value={`${opacityPercent}%`}
        css={`
          width: 100%;
          font-size: 12px;
          border: none;
          background: transparent;
          outline: none;
          height: 100%;
        `}
        disabled={disabled}
        onChange={handleChange}
        maxLength={4}
        minLength={1}
      />
    </div>
  );
};
