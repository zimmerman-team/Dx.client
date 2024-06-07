import { css } from "styled-components/macro";

export const turnsDataCss = css`
  /* margin-top: 60px;
  padding: 0;
  @media screen and (max-width: 768px) {
    justify-content: center;
    align-items: center;
  } */
  display: flex;
  justify-content: space-between;
  align-items: center;

  h1 {
    font-family: "GothamNarrow-Bold", sans-serif;
    font-weight: 400;
    font-size: 34px;
    line-height: 42px;
    /* text-align: center; */
    color: #2b3674;
    margin: 0;
    padding: 0;
  }

  p {
    color: #495057;
    font-family: "GothamNarrow-Bold", sans-serif;
    font-size: 18px;
    line-height: 22px;
    text-align: center;
    margin: 0;
    display: flex;
    justify-content: center;
  }

  button,
  a {
    padding: 8px 24px;
    height: 41px;
    border-radius: 25px;
    outline: none;
    border: none;
    color: #ffffff;
    font-family: "GothamNarrow-Bold", sans-serif;
    font-weight: 400;
    font-size: 14px;
    text-transform: uppercase;
    text-decoration: none;
    font-size: 14px;
    font-style: normal;
    line-height: 24px; /* 171.429% */
    letter-spacing: -0.28px;

    :hover {
      opacity: 0.8;
      cursor: pointer;
    }
  }
`;

export const featuredAssetsCss = css`
  h3 {
    font-size: 24px;
    font-family: "GothamNarrow-Bold", sans-serif;
    line-height: 29px;
    color: #000000;
    margin: 0;
  }
`;

export const datsetDetailImgcss = css`
  width: 710px;
  height: 428px;
  border-radius: 14px;
`;

export const rowFlexCss = css`
  display: flex;

  justify-content: center;
  align-items: center;
`;

export const bottomLeftEllipseCss = css`
  left: 0;
  bottom: 0;
  z-index: -1;
  position: absolute;
`;

export const bottomRightEllipseCss = css`
  right: 0;
  bottom: 0;
  z-index: -1;
  position: absolute;
`;

export const TopRightEllipseCss = css`
  top: 0;
  right: 0;
  z-index: -1;
  position: absolute;
`;

export const searchInputCss = (
  openSearch: boolean,
  width: string = "385px"
) => css`
  background: #dadaf8;
  display: flex;
  align-items: center;
  width: ${width ?? "385px"};
  height: 32px;
  border-radius: 20px;
  opacity: ${openSearch ? 1 : 0};
  transition: all 0.5s ease-in-out 0s;
  input {
    outline: none;
    height: 100%;
    width: 92%;
    color: #231d2c;
    font-size: 14px;
    background: inherit;
    border-style: none;
    border-radius: 20px;

    padding: 6px 16px !important;
  }
`;

export const iconButtonCss = (active?: boolean) => css`
  padding: 3px;
  ${active
    ? ` svg > circle {
      fill:  #231d2c;
    }
    svg > path,
    svg > g > path,
    svg > g > rect {
      fill: #dadaf8;
    }`
    : ""}

  &:hover {
    background: transparent;
    padding: none;

    svg > circle {
      fill: #231d2c;
    }
    svg > path,
    svg > g > path,
    svg > g > rect {
      fill: #dadaf8;
    }
  }
`;

export const sortByItemCss = (active: boolean) => css`
  color: #231d2c;
  font-size: 12px;
  padding: 8px 22px;
  font-family: "GothamNarrow-Book", sans-serif;
  background: ${active ? "#f1f3f5" : "transparent"};

  &:hover {
    cursor: pointer;
    background: #f1f3f5;
  }
`;
