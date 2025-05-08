import { css } from "styled-components";
import { MOBILE_BREAKPOINT } from "app/theme";
export const layoutcss = css`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: calc(100vh - 50px);
`;

export const tabcss = (active: boolean, disabled: boolean) => css`
  width: 224px;
  height: 48px;
  border: 1px solid #231d2c;
  border-radius: 10px;
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  padding: 12px 24px;
  pointer-events: ${disabled ? "none" : "auto"};
  opacity: ${disabled ? "0.25" : "1"};
  background-color: ${active ? "#231D2C" : "transparent"};
  cursor: pointer;
  p {
    font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
    text-transform: capitalize;
    color: ${active ? "#ffffff" : "#231D2C"};
  }
  @media (max-width: 960px) {
    width: 100%;
  }
`;

export const profilecss = css`
  font-style: normal;
  width: 500px;
  h4 {
    font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
    font-weight: 700;
    font-size: 36px;
    color: #6061e5;
    margin: 0;
    margin-bottom: 24px;
  }
  p {
    font-weight: 400;
    font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
    font-size: 18px;
    margin: 0;
  }
  @media (max-width: 960px) {
    width: 100%;
  }
`;

export const billingcss = {
  heading: css`
    color: #6061e5;
    font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
    font-size: 36px;
    height: 38px;
    margin: 0;
    margin-bottom: 24px;
  `,
  section: css`
    display: flex;
    gap: 50px;
    align-items: flex-start;
    margin-bottom: 24px;

    > p:nth-child(1) {
      min-width: 130px;
      font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
      font-size: 18px;
      color: #231d2c;
      margin: 0px;
    }
    @media (max-width: ${MOBILE_BREAKPOINT}) {
      margin-bottom: 24px;
      gap: 8px;
      flex-wrap: wrap;
      > p:nth-child(1) {
        width: 100%;
      }
    }
  `,
  end: css`
    p {
      font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
      font-size: 14px;
      line-height: 24px;
      margin-bottom: 8px;
      margin-top: 0px;
    }
    @media (max-width: ${MOBILE_BREAKPOINT}) {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      p {
        width: 100%;
      }
      div {
        width: 100%;
        button {
          justify-self: flex-end;
          width: max-content;
        }
      }
    }
  `,
  planButtons: css`
    display: flex;
    gap: 16px;
    @media (max-width: ${MOBILE_BREAKPOINT}) {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: end;
      width: max-content;
    }
  `,
  billingInfo: css``,
};

export const flexContainercss = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
`;

export const bigAvicss = css`
  width: 224px;
  height: 224px;
  background: #dadaf8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  p {
    font-weight: 325;
    font-size: 96px;
    color: #231d2c;
  }
`;

export const avicss = css`
  width: 52px;
  height: 52px;
  background: #dadaf8;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  justify-self: flex-start;
  font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
  font-size: 22.0606px;
  line-height: 32px;
  b {
  }
`;

export const inputcss = css`
  border-radius: 16px;
  background: #f4f4f4;
  height: 48px;
  color: #231d2c;
  width: 320px;
  padding: 14.5px 24px;
  border: 1px solid #f4f4f4;
  outline: none;
  font-size: 16px;
  :focus {
    border: 1px solid #231d2c;
  }
  @media (max-width: ${MOBILE_BREAKPOINT}) {
    width: 100%;
  }
`;
