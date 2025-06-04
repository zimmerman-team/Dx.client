import { MOBILE_BREAKPOINT, TABLET_STARTPOINT } from "app/theme";
import { getContrastColor } from "app/utils/getContrastColor";
import { css } from "styled-components/macro";

export const styles = {
  container: (toolbarVisible: boolean) => css`
    left: 0;
    top: 50px;
    z-index: 100;
    width: 100vw;
    height: ${toolbarVisible ? "105px" : "50px"};
    transition: all cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
    display: flex;
    position: fixed;
    background: #f4f4f4;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    @media (max-width: 881px) {
      top: 66px;
    }
  `,
  innercontainer: css`
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;

    @media (max-width: 1280px) {
      margin-left: 0;
      width: 100%;
    }
  `,
  viewStoryBtn: css`
    height: 24.3px;
    background: #231d2c;
    border-radius: 30px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 5.5px 10px;
    gap: 5.959px;
    outline: none;
    border: none;
    cursor: pointer;
    text-transform: uppercase;
    color: white;
    text-decoration: none;
    font-weight: 325;
    font-size: 8.43px;
    font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
  `,
  sharePopup: css`
    width: 170px;
    display: flex;
    padding: 6px 13px;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;

    * {
      margin: 0;
      color: #fff;
      font-size: 14px;
    }

    .MuiSwitch-track {
      background: #98a1aa;
    }

    .MuiSwitch-colorPrimary.Mui-checked + .MuiSwitch-track {
      background: #000;
    }

    hr {
      width: 100%;
      background: #cfd4da;
    }

    button {
      width: 100%;
      padding: 6px 0;
      text-align: start;
      justify-content: flex-start;

      span {
        text-transform: initial;
      }

      svg {
        margin-right: 10px;

        path {
          fill: #fff;
        }
      }
    }
  `,
  nameInput: css`
    color: #262c34;
    font-size: 24px;
    font-weight: 400;
    border-style: none;
    background: transparent;
    transition: background 0.2s ease-in-out;
    font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
    position: relative;
    z-index: 2;
    padding-left: 0px;
    outline: none;
    @media (max-width: ${MOBILE_BREAKPOINT}) {
      font-size: 20px;
    }
  `,
  endContainer: css`
    display: flex;
    gap: 22px;
    align-items: center;
    width: 30%;
    justify-content: flex-end;
    flex-shrink: 0;
    @media (min-width: ${TABLET_STARTPOINT}) {
      @media (max-width: 800px) {
        width: 52%;
      }
    }
    @media (min-width: 801px) {
      @media (max-width: 1199px) {
        width: 51%;
      }
    }
  `,
  previewEndContainer: css`
    display: flex;
    gap: 0px;
    align-items: center;
    width: 30%;
    justify-content: flex-end;
    margin-right: -12px;
  `,
  iconbtns: css`
    display: flex;
    flex-direction: row;
  `,

  autoResizeSpan: css`
    font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
    font-size: 24px;
    position: absolute;
    z-index: 1;
    left: -5px;
    padding: 5px;
    white-space: pre;
    font-size: 24px;
    font-weight: 400;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    @media (max-width: ${MOBILE_BREAKPOINT}) {
      font-size: 20px;
      left: 25px;
    }
  `,
  highlightPicker: css`
    vertical-align: bottom;
    border: none;
    outline: none;
    color: #70777e;
    font-size: 18px;
    height: 35px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &:hover {
      opacity: 0.6;
    }
    @media (max-width: 1050px) {
      width: 24px;
    }
  `,
  bgHighlightPicker: (color: string) => css`
    background-color: ${color};
    svg {
      path {
        fill: ${getContrastColor(color)};
      }
    }
  `,
  colorPicker: (color: string) => css`
    background-color: ${color};
    svg {
      path {
        fill: ${getContrastColor(color)};
      }
    }
  `,
};
