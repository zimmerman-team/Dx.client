import React, { memo, useCallback, useMemo } from "react";

import { Interactive } from "app/components/ColorPicker/components/interactive";
import { useBoundingClientRect } from "app/components/ColorPicker/hooks/useBoundingClientRect";
import {
  ColorService,
  IColor,
} from "app/components/ColorPicker/services/color";

interface IHueProps {
  readonly color: IColor;
  readonly disabled?: boolean;
  readonly onChange: (color: IColor) => void;
  readonly onChangeComplete?: (color: IColor) => void;
}

export const Hue = memo(
  ({ color, disabled, onChange, onChangeComplete }: IHueProps) => {
    const [hueRef, { width }] = useBoundingClientRect<HTMLDivElement>();

    const position = useMemo(() => {
      const x = (color.hsv.h / 360) * width;

      return { x };
    }, [color.hsv.h, width]);

    const updateColor = useCallback(
      (final: boolean, x: number) => {
        const nextColor = ColorService.convert("hsv", {
          ...color.hsv,
          h: (x / width) * 360,
        });

        onChange(nextColor);
        if (final) onChangeComplete?.(nextColor);
      },
      [color.hsv, width, onChange, onChangeComplete]
    );

    const hsl = useMemo(
      () => [color.hsv.h, "100%", "50%"].join(" "),
      [color.hsv.h]
    );

    return (
      <Interactive disabled={disabled} onCoordinateChange={updateColor}>
        <div ref={hueRef} className="rcp-hue">
          <div
            style={{ left: position.x, backgroundColor: `hsl(${hsl})` }}
            className="rcp-hue-cursor"
          />
        </div>
      </Interactive>
    );
  }
);
