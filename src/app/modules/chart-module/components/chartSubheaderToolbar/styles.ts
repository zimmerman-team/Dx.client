import { css } from "styled-components/macro";

export const styles = {
  container: css`
    left: 0;
    top: 50px;
    z-index: 100;
    width: 100vw;
    height: 50px;
    display: flex;
    position: fixed;
    background: #f4f4f4;
    flex-direction: column;
    justify-content: center;
    @media (max-width: 881px) {
      top: 66px;
    }
  `,
  innercontainer: css`
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    gap: 10px;
  `,
  backToEdit: css`
    height: 36px;
    background: #231d2c;
    border-radius: 30px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 6px 27px;
    gap: 10px;
    outline: none;
    border: none;
    cursor: pointer;
    text-transform: uppercase;
    color: white;
    text-decoration: none;
  `,
  backToStory: css`
    background: #231d2c;
    border-radius: 8px;
    display: flex;
    flex-shrink: 0;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 32px;
    padding: 10px 20px;
    font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
    gap: 10px;
    outline: none;
    border: none;
    cursor: pointer;
    color: white;
    text-decoration: none;
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
    margin: 0;
    display: flex;
    color: #262c34;
    font-size: 24px;
    font-weight: 700;
    border-style: none;
    background: transparent;
    transition: background 0.2s ease-in-out;
    font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;

    &:focus {
      background: #f1f3f5;
    }
    @media (max-width: 600px) {
      font-size: 20px;
    }
  `,
  endContainer: css`
    display: flex;
    right: 23px;
    position: absolute;
    gap: 13px;
    @media (max-width: 1216px) {
      right: 20px;
    }
    @media (max-width: 881px) {
      right: 11px;
    }
  `,
  iconbtns: css`
    display: flex;
    flex-direction: row;

    > a,
    button {
      width: 40px;
      height: 40px;
      padding: 9px;
    }
  `,
};
