import { FOCUS_VISIBLE_STYLE_LIGHT } from "app/theme";
import { css } from "styled-components";

export const elementItemcss = (
  disabled: boolean,
  isDragging: boolean,
  draggable?: boolean,

  upgradeRequired?: boolean
) => css`
  cursor: ${disabled ? "not-allowed" : !draggable ? "pointer" : "grab"};
  ${isDragging && "cursor: grabbing;"}

  display: flex;
  align-items: center;
  gap: 16px;
  height: 64px;
  background: #dfe3e5;
  border-radius: 8px;
  outline: none;
  border: none;
  width: 100%;
  text-align: left;
  opacity: ${upgradeRequired ? 0.2 : disabled ? 0.5 : 1};
  position: relative;
  padding: 0 8px 0 16px;
  :focus-visible {
    ${FOCUS_VISIBLE_STYLE_LIGHT}
  }

  p {
    margin: 0px;
    line-height: normal;
    font-size: 12px;
    font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
  }
  b {
    font-size: 14px;
    line-height: normal;
    margin: 0;
    font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
  }
  ${!disabled &&
  "&:hover {svg {path {fill: #fff;}}background: #252c34;b,p {color: #fff;}}"}
`;
