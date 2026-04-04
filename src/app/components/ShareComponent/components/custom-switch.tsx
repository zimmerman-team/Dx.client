import React from "react";

interface CustomSwitchProps {
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

export const CustomSwitch: React.FC<CustomSwitchProps> = ({
  checked,
  onChange,
}) => {
  return (
    <button
      type="button"
      css={`
        width: 44px;
        height: 22px;
        border-radius: 11px;
        border: 1px solid ${checked ? "transparent" : "#BFBFBF"};
        background-color: ${checked ? "#0D6EFD" : "#FFFFFF"};
        padding: 1px;
        cursor: pointer;
      `}
      onClick={() => {
        onChange?.(!checked);
      }}
    >
      <div
        css={`
          width: 18px;
          height: 18px;
          background-color: ${checked ? "#ffffff" : "#BFBFBF"};
          border-radius: 50%;
          position: relative;
          transform: translateX(${checked ? "22px" : "0px"});
          transition: all 0.3s ease-in-out;
        `}
      />
    </button>
  );
};
