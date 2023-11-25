import { css } from "styled-components/macro";

export const styles = {
  container: (toolbarVisible: boolean) => css`
    left: 0;
    top: 48px;
    z-index: 100;
    width: 100vw;
    height: ${toolbarVisible ? "105px" : "50px"};
    transition: all cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
    display: flex;
    position: fixed;
    background: #f4f4f4;
    flex-direction: column;
    justify-content: start;
    align-items: center;
  `,
  innercontainer: css`
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;

    @media (max-width: 1280px) {
      margin-left: 0;
      width: calc(100vw - 400px);
    }

    @media (max-width: 600px) {
      padding: 13px 16px 0 16px;
    }
  `,
  viewReportBtn: css`
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
    font-weight: 500;
    font-size: 8.43px;
    font-family: "Inter", sans-serif;
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
    /* overflow: hidden;
    height: 0px; */

    color: #262c34;
    font-size: 24px;
    font-weight: 700;
    border-style: none;
    background: transparent;
    transition: background 0.2s ease-in-out;
    font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
    overflow-x: visible;
    outline: none;
    /* padding-left: 5px; */
    &:focus {
      background: #f1f3f5;
    }

    /* color: #262c34;
    font-size: 12px;
    line-height: 14px;
    letter-spacing: 0.6px;
    font-family: sans-serif;
    font-weight: 400;
    height: 20px;
    min-width: 150px;
    border: none;
    border-bottom: 5px solid green;
    background-color: transparent;

    outline: none;
    padding-left: 5px; */
  `,
  endContainer: css`
    display: flex;
    gap: 67px;
    align-items: center;
    width: 30%;
    justify-content: flex-end;
    /* background-color: pink; */
  `,
  iconbtns: css`
    display: flex;
    flex-direction: row;
  `,

  autoResizeSpan: css`
    visibility: hidden;
    position: fixed;
    left: 0;
    padding: 5px;
    white-space: pre;
    font-size: 24px;
    font-weight: 700;
    /* color: #262c34;
    font-size: 12px;
    line-height: 14px;
    letter-spacing: 0.6px;
    font-family: sans-serif;
    font-weight: 400;
    height: 20px;
    min-width: 150px;
    border: none;
    border-bottom: 5px solid pink;
    background-color: transparent;

    visibility: hidden;
    position: fixed;
    left: 0;
    padding: 5px; */
  `,
};
