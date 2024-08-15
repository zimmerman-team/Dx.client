import { css } from "styled-components/macro";
import styled from "styled-components/macro";
import Ellipses from "app/modules/home-module/assets/ellipses.svg";
import Ellipses2 from "app/modules/home-module/assets/ellipses-2.svg";

export const empowercss = (view: string) => css`
  height: ${view === "landing" ? "533px" : "418px"};
  position: relative;
  margin-top: 48px;
  padding: 78px 0 55px 0;
  font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
  background: url(${view === "landing" ? Ellipses2 : Ellipses}),
    linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #f2f7fd 100%);
  background-repeat: no-repeat;
  background-size: 100% 100%, auto;
  a {
    text-decoration: none;
  }

  h1 {
    margin-top: 0;
    color: #231d2c;
    font-size: 48px;
    line-height: 57.6px;
    white-space: pre-line;
    text-align: center;
    margin-bottom: ${view === "landing" ? "14px" : "26px"};
    font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
  }
  p {
    margin: 0;
    color: #495057;
    font-size: 18px;
    line-height: 22px;
    text-align: center;
    font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
  }
  div {
    gap: 34px;
    display: flex;
    margin-top: ${view === "landing" ? "28px" : "50px"};
    align-items: center;
    justify-content: center;
  }
  #auth-buttons {
    button,
    a {
      padding: 9px 27px;
      height: 41px;
      border-radius: 30px;
      outline: none;
      border: none;
      color: #ffffff;
      font-family: "Inter", sans-serif;
      font-weight: 700;
      font-size: 14px;
      text-transform: uppercase;
      text-decoration: none;

      :hover {
        opacity: 0.8;
        cursor: pointer;
      }
    }
  }
`;

export const TabCardEllipseCss = css`
  top: 7%;
  right: 25%;
  z-index: -1;
  position: absolute;
`;

export const quotesEllipseCss = css`
  top: 0%;
  left: -8.1%;
  z-index: -1;
  position: absolute;
`;

export const useDXcss = css`
  color: #231d2c;
  width: 100%;
  margin-top: 40px;
  p:nth-of-type(1) {
    font-size: 40px;
    line-height: 48px;
    text-align: center;
    font-family: "GothamNarrow-Medium", "Helvetica Neue", sans-serif;
    margin-top: 0;
  }
  h3 {
    font-size: 24px;
    line-height: 29px;
    font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
    text-align: center;
    margin-bottom: 0;
    margin-top: 48px;
  }
  p {
    font-size: 20px;
    line-height: 24px;
    text-align: center;
    font-family: "GothamNarrow-Medium", "Helvetica Neue", sans-serif;
    width: 85%;
    margin: 16px auto 0 auto;
  }
`;

export const quotecss = css`
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  width: 78%;
  p {
    font-size: 40px;
    line-height: 48px;
    text-align: center;
    font-family: "GothamNarrow-Medium", "Helvetica Neue", sans-serif;

    margin: 0;
  }
  img {
    margin-bottom: 15px;
  }
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 28px;
    b {
      color: #6061e5;
      margin: 0;
      font-size: 16px;
      line-height: 19px;
      text-align: center;
      font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
    }
  }
`;

export const bestDecisioncss = css`
  h4 {
    font-size: 48px;
    line-height: 58px;
    text-align: center;
    font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
    color: #231d2c;
    margin: 0;
    margin-bottom: 36px;
  }
  div {
    button {
      gap: 10px;
      color: #231d2c;
      display: flex;
      padding: 9px 18px;
      background: #fff;
      font-weight: 700;
      font-family: "Inter", sans-serif;
      font-size: 14px;
      align-items: center;
      justify-content: center;
      text-transform: uppercase;
      border: none;
      outline: none;
      border-radius: 30px;
      :hover {
        opacity: 0.95;
        cursor: pointer;
      }
      > svg {
        transform: scale(0.8);
      }
    }
  }
  a {
    button {
      outline: none;
      border: none;
      background: #ffffff;
      border-radius: 30px;
      height: 41px;
      color: #231d2c;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 12px 27px;
      gap: 10px;
      p {
        text-transform: uppercase;
        font-family: "Inter", sans-serif;
        font-weight: 700;
        font-size: 14px;
        color: #231d2c;
      }
      :hover {
        opacity: 0.95;
        cursor: pointer;
      }
    }
  }
`;

export const ClimateButton = styled.button`
  padding: 12px 27px;
  border-radius: 30px;
  outline: none;
  border: none;
  color: #ffffff;
  font-family: "Inter", sans-serif;
  font-weight: 700;
  font-size: 14px;
  text-transform: uppercase;
  background: ${(props) => (props.color ? props.color : "inherit")};
  :hover {
    opacity: 0.8;
    cursor: pointer;
  }
`;
