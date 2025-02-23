import { css } from "styled-components/macro";
import styled from "styled-components/macro";

export const empowercss = (view: string) => css`
  height: ${view === "landing" ? "533px" : "418px"};
  position: relative;
  margin-top: 48px;
  padding: 78px 0 55px 0;
  font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #f2f7fd 100%);
  background-repeat: no-repeat;
  background-size: 100% 100%, auto;
  overflow: hidden;
  z-index: 0;
  @media (max-width: 655px) {
    height: 100%;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0) 0%,
      #f2f7fd 100%
    );
  }
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
    @media (max-width: 1024px) {
      font-size: 40px;
      line-height: 48px;
    }
    &:nth-of-type(1) {
      @media (max-width: 501px) {
        display: none;
      }
    }
    &:nth-of-type(2) {
      @media (min-width: 501px) {
        display: none;
      }
    }
  }
  p {
    margin: 0;
    color: #495057;
    font-size: 18px;
    line-height: 22px;
    text-align: center;
    font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
    font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
    @media (max-width: 500px) {
      white-space: pre-line;
    }
  }
  div {
    display: flex;
    margin-top: ${view === "landing" ? "28px" : "50px"};
    align-items: center;
    justify-content: center;
    gap: 16px;

    @media (max-width: 768px) {
      gap: 8px;
    }
    @media (max-width: 411px) {
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      a {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        button {
          width: 80%;
        }
      }
    }
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
      font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
      font-weight: 400;
      font-size: 14px;
      text-transform: uppercase;
      text-decoration: none;

      :hover {
        opacity: 0.8;
        cursor: pointer;
      }
      @media (max-width: 500px) {
        font-size: 13px;
        padding: 8px 16px;
        width: 185px;
      }
    }
  }
`;

export const TabCardEllipseCss = css`
  top: 7%;
  right: 25%;
  z-index: -1;
  position: absolute;
  @media (max-width: 500px) {
    top: 7%;
    right: -180px;
    width: 100%;
  }
`;

export const quotesEllipseCss = css`
  top: 0%;
  left: -8.1%;
  z-index: -1;
  position: absolute;
  @media (max-width: 500px) {
    width: 100%;
    height: 100%;
    left: -51%;
  }
`;

export const useDXcss = css`
  color: #231d2c;
  width: 100%;
  p:nth-of-type(1) {
    font-size: 40px;
    line-height: normal;
    text-align: center;
    font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
    margin-top: 0;
    @media (max-width: 1024px) {
      font-family: "GothamNarrow-Bold", sans-serif;
      font-size: 36px;
    }
    @media (max-width: 600px) {
      font-size: 24px;
    }
  }
  h3 {
    font-size: 24px;
    line-height: 29px;
    font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
    text-align: center;
    margin-bottom: 0;
    margin-top: 48px;
    @media (max-width: 1024px) {
      font-family: "GothamNarrow-Bold", sans-serif;
      font-size: 24px;
    }
    @media (max-width: 600px) {
      font-size: 18px;
    }
  }
  p {
    font-size: 20px;
    line-height: 24px;
    text-align: center;
    font-family: "GothamNarrow-Medium", "Helvetica Neue", sans-serif;
    width: 85%;
    margin: 16px auto 0 auto;
    @media (max-width: 1024px) {
      margin: 16px 0 0 0;
      font-size: 18px;
      width: 100%;
      font-family: "GothamNarrow-Book", sans-serif;
      @media (max-width: 600px) {
        font-size: 18px;
      }
    }
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
    font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
    margin: 0;
    @media (max-width: 1024px) {
      font-size: 34px;
      line-height: 40.8px;
    }
    @media (max-width: 1024px) {
      font-size: 24px;
      line-height: 28.8px;
    }
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
      @media (max-width: 1024px) {
        font-size: 14px;
        line-height: 16.8px;
      }
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
    @media (max-width: 1024px) {
      font-size: 34px;
      line-height: 40.8px;
    }
  }
`;

export const ClimateButton = styled.button`
  padding: 12px 27px;
  border-radius: 30px;
  outline: none;
  border: none;
  color: #ffffff;
  font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
  font-weight: 400;
  font-size: 14px;
  text-transform: uppercase;
  background: ${(props) => (props.color ? props.color : "inherit")};
  :hover {
    opacity: 0.8;
    cursor: pointer;
  }
`;
