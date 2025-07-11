import {
  DESKTOP_BREAKPOINT,
  MOBILE_BREAKPOINT,
  TABLET_STARTPOINT,
} from "app/theme";
import { css } from "styled-components/macro";

export const benefitscss = css`
  position: relative;
  z-index: 1;

  h2 {
    font-size: 48px;
    line-height: 43px;
    text-align: center;
    color: #000000;
    font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
    margin-bottom: 66px;
    margin-top: 0px;
  }
  h3 {
    font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
    font-weight: 400;
    font-size: 40px;
    line-height: 48px;
    margin: 0;
  }

  p {
    font-size: 20px;
    line-height: 24px;
    font-family: "GothamNarrow-Medium", "Helvetica Neue", sans-serif;
    margin-top: 14px;
  }
`;

export const keyfeaturescss = {
  container: css`
    position: relative;
    z-index: 1;
    padding-top: 80px;

    @media (max-width: 1024px) {
      padding-top: 40px;
    }

    svg {
      @media (max-width: 1200px) {
        flex-direction: column;
        width: 100%;
        height: 100%;
        margin: unset;
      }
    }
    h3 {
      font-size: 48px;
      line-height: 43px;
      text-align: center;
      color: #231d2c;
      margin-top: 0;
      margin-bottom: 80px;
      font-family: "GothamNarrow-Bold", sans-serif;
      @media (max-width: 1200px) {
        font-size: 36px;
        line-height: normal;
      }
      @media (max-width: 600px) {
        font-size: 24px;
        line-height: normal;
        margin-bottom: 48px;
      }
    }
    p:nth-of-type(1) {
      font-size: 40px;
      line-height: 20px;
      font-family: "GothamNarrow-Bold", sans-serif;
      margin-bottom: 25px;
      margin-top: 0;
      color: #231d2c;
      @media (min-width: ${TABLET_STARTPOINT}) {
        @media (max-width: ${DESKTOP_BREAKPOINT}) {
          font-size: 36px;
        }
      }
      @media (max-width: ${MOBILE_BREAKPOINT}) {
        font-size: 18px;
        line-height: normal;
        text-align: left;
      }
    }
    p:nth-of-type(2) {
      margin: 0;
      font-family: "GothamNarrow-Book", sans-serif;
      line-height: 30px;
      letter-spacing: 0.5px;
      font-size: 24px;
      color: #231d2c;
      @media (max-width: ${MOBILE_BREAKPOINT}) {
        font-size: 12px;
        line-height: normal;
        text-align: left;
      }
    }
    @media (min-width: 750px) {
      @media (max-width: 1024px) {
        padding-top: 40px;
      }
    }
    @media (max-width: 600px) {
      padding-top: 56px;
    }
  `,
  flexContainer: (reverse: boolean) => css`
    display: flex;
    align-items: center;
    column-gap: 83px;
    @media (min-width: ${TABLET_STARTPOINT}) {
      @media (max-width: ${DESKTOP_BREAKPOINT}) {
        row-gap: 40px;
        flex-direction: ${reverse ? "column-reverse" : "column"};
      }
    }
    @media (max-width: ${MOBILE_BREAKPOINT}) {
      row-gap: 40px;
      flex-direction: ${reverse ? "column-reverse" : "column"};
    }
  `,
  text: css`
    @media (min-width: 1111px) {
      @media (max-width: 1279px) {
        width: 91%;
      }
    }
    @media (max-width: 1110px) {
      width: 85%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      margin: auto;
    }
    @media (max-width: 600px) {
      width: 100%;
      display: flex;
      flex-direction: column;
    }
  `,
};

export const firstColcss = css`
  display: grid;
  grid-template-rows: 42.45% 55.5%;
  row-gap: 17px;
  div {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding-left: 19px;
    padding-right: 19px;
  }
  div:nth-child(1) {
    width: 580px;
    height: 363px;
    background: #6061e5;
    border-radius: 16px;
    h3 {
      color: #fff;
    }
    p {
      color: #fff;
    }
  }
  div:nth-child(2) {
    width: 580px;
    height: 475px;
    background: #dadaf8;
    border-radius: 16px;
    h3 {
      color: #000000;
    }
    p {
      color: #000000;
    }
  }
`;

export const secondColcss = css`
  display: grid;
  grid-template-rows: auto auto;
  row-gap: 17px;
  div {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding-left: 19px;
    padding-right: 19px;

    h3 {
      color: #fff;
    }
    p {
      color: #fff;
    }
  }
  div:nth-child(1) {
    width: 323px;
    height: 274px;
    background: #359c96;
    border-radius: 16px;
  }
  div:nth-child(2) {
    width: 323px;
    height: 273px;
    background: #231d2c;
    border-radius: 16px;
  }

  div:nth-child(3) {
    width: 323px;
    height: 273px;
    background: #e492bd;
    border-radius: 16px;
  }
`;

export const thirdColcss = css`
  display: grid;
  grid-template-rows: 72% 38%;
  row-gap: 17px;
  div {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding-left: 19px;
    padding-right: 19px;
  }
  div:nth-child(1) {
    width: 296px;
    height: 609px;
    background: #daf5f3;
    border-radius: 16px;
    h3 {
      color: #000000;
    }
    p {
      color: #000000;
    }
  }
  div:nth-child(2) {
    width: 296px;
    height: 223px;
    background: #adb5bd;
    border-radius: 16px;
    h3 {
      color: #fff;
    }
    p {
      color: #fff;
    }
  }
`;
