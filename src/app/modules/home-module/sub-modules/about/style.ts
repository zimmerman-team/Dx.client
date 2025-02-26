import { css } from "styled-components/macro";

export const subParagraphcss = css`
  color: #231d2c;
  @media (max-width: 1024px) {
    padding: 0 48px;
  }
  @media (max-width: 500px) {
    padding: 0;
  }
  > div:nth-of-type(1) {
    display: flex;
    column-gap: 97px;
    align-items: center;
    @media (max-width: 1024px) {
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      row-gap: 40px;
    }
  }

  #ab-desktop {
    margin: 0;
    font-size: 40px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    font-family: "GothamNarrow-Bold", sans-serif;
    display: block;
    @media (max-width: 1024px) {
      font-size: 36px;
      text-align: left;
    }
    @media (max-width: 500px) {
      font-size: 18px;
    }
  }
  p {
    margin: 0;
    font-family: "GothamNarrow-Medium", "Helvetica Neue", sans-serif;
    font-size: 24px;
    font-style: normal;
    font-weight: 350;
    line-height: 30px; /* 150% */
    letter-spacing: 0.5px;
    @media (max-width: 1024px) {
      text-align: left;
      font-size: 24px;
      font-family: "GothamNarrow-Book", sans-serif;
      line-height: 28.5px; /* 150% */
    }
    @media (max-width: 500px) {
      font-size: 12px;
      font-family: "GothamNarrow-Book", sans-serif;
      line-height: 16.8px; /* 150% */
    }
  }
  svg {
    @media (max-width: 1024px) {
      width: 100%;
      height: 100%;
    }
  }
`;
