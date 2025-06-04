import React, { useState } from "react";
import styles from "./InlineColorPicker.module.css";
import { ColorPicker } from "app/components/ColorPicker";
import {
  ColorService,
  IColor,
} from "app/components/ColorPicker/services/color";
import { ClickAwayListener } from "@material-ui/core";

interface Props {
  color?: string;
  onChange: (color: IColor) => void;
  defaultColor?: string;
}
const def_color = "#231d2c";

export default function InlineColorPicker({
  color: maybeColor,
  onChange,
  defaultColor = def_color,
}: Props) {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const color = maybeColor ?? defaultColor; // Same as <input type='color' />

  const pickerRef = React.useRef<HTMLDivElement | null>(null);

  const rect = pickerRef?.current?.getBoundingClientRect();

  const heightDifference = rect
    ? document.documentElement.scrollHeight - (window.scrollY + rect.bottom)
    : 0;

  const heightCheck = 350;

  return (
    <ClickAwayListener onClickAway={() => setDisplayColorPicker(false)}>
      <div
        css={`
          position: relative;
        `}
      >
        <div
          className={styles.swatch}
          onClick={() => setDisplayColorPicker(true)}
          id="inline-color-picker-swatch"
          ref={pickerRef}
          data-cy="color-picker"
        >
          <div className={styles.color} style={{ background: color }} />
          {color.toUpperCase()}
        </div>
        {displayColorPicker && (
          <div
            css={`
              position: absolute;
              z-index: 2000;
              right: 0;
              ${heightDifference < heightCheck
                ? "bottom: 100%;"
                : "top: 100%;"};
            `}
            id="inline-color-picker-popover"
          >
            <div
              data-cy="sketch-picker"
              css={`
                .sketch-pickerz {
                  padding: 6px !important;
                  width: 274px !important;

                  border: none;
                  border-radius: 10px !important;
                  background: var(--Secondary-Grey-Grey-8, #f1f3f5);
                  box-shadow: 0px 0px 10px 0px rgba(152, 161, 170, 0.6) !important;
                  > div:nth-of-type(1) {
                    padding-bottom: 45% !important;
                  }
                  > .flexbox-fix:nth-of-type(4) {
                    div {
                      width: 24px !important;
                      height: 24px !important;
                      border-radius: 50% !important;
                      border: none !important;
                      &:hover {
                        border-radius: 100px;
                        border: 2px solid var(--white, #fff);
                        background: var(--indigo-500, #6467f2);
                        box-shadow: 0px 0px 0px 2px rgba(0, 0, 0, 0.25);
                      }
                    }
                  }
                }
              `}
            >
              <ColorPicker
                onChange={onChange}
                color={ColorService.convert("hex", color)}
                onResetColor={() =>
                  onChange(ColorService.convert("hex", defaultColor))
                }
              />
            </div>
          </div>
        )}
      </div>
    </ClickAwayListener>
  );
}
