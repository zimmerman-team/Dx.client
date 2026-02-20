import React from "react";

import styled from "styled-components";
interface Props {
  checked: boolean;
  setAutoSave?: React.Dispatch<React.SetStateAction<boolean>>;
}

const StyledLabel = styled.label<Props>`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 22px;
  border-radius: 36px;
  background-color: ${({ checked }) => (checked ? "#0D6EFD" : "#FFF")};
  cursor: pointer;
  padding-right: 4px;
  p {
    color: #fff;
    margin: 0;
    font-size: 12px;
    transform: ${({ checked }) =>
      checked ? "translateX(6px)" : "translateX(32px)"};
  }
`;

const StyledInput = styled.input`
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 36px;
  appearance: none;
  cursor: pointer;
`;

const StyledSpan = styled.span<Props>`
  position: absolute;
  left: -2px;
  width: 18px;
  height: 18px;
  border-radius: 36px;
  transition: transform 0.3s ease-in-out;
  top: 2.3px;
  background-color: ${({ checked }) => (checked ? "#FFF" : "#D1D5DB")};
  cursor: pointer;
  transform: ${({ checked }) =>
    checked ? "translateX(24px)" : "translateX(6px)"};
`;

const ToggleSwitch = (props: {
  checked: boolean;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <StyledLabel checked={props.checked}>
      <StyledInput
        type="checkbox"
        checked={props.checked}
        onChange={(e) => {
          props.setChecked(e.target.checked);
        }}
        data-testid={"share-switch"}
      />
      <StyledSpan checked={props.checked} />
    </StyledLabel>
  );
};

export default ToggleSwitch;
