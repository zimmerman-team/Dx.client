import React from "react";
import { ReactComponent as InlineGFLogo } from "app/modules/home-module/sub-modules/partners/assets/inline-gf-logo.svg";

export default function DXBlock() {
  return (
    <div
      css={`
        color: #231d2c;
        width: 100%;
      `}
    >
      <p
        css={`
          font-size: 48px;
          line-height: normal;
          font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
          margin: 0;
          display: flex;
          column-gap: 20px;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          @media (max-width: 1439px) {
            font-family: "GothamNarrow-Bold", sans-serif;
            font-size: 34px;
            svg {
              width: 401.75px;
            }
          }
          @media (max-width: 743px) {
            text-align: left;
            justify-content: flex-start;
          }
        `}
      >
        <InlineGFLogo /> Case Study
      </p>

      <h3
        css={`
          font-size: 34px;
          line-height: 29px;
          font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
          text-align: center;
          margin: 0;
          margin-top: 40px;
          @media (max-width: 1439px) {
            font-family: "GothamNarrow-Bold", sans-serif;
            font-size: 24px;
          }
          @media (max-width: 743px) {
            font-size: 18px;
            text-align: left;
          }
        `}
      >
        The Global Fund to fight AIDS, Tuberculosis and Malaria
      </h3>
      <p
        css={`
          font-size: 18px;
          line-height: 24px;
          text-align: center;
          font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
          width: 85%;
          margin: 12px auto 0 auto;
          @media (max-width: 1439px) {
            margin: 12px 0 0 0;
            width: 100%;
            text-align: justify;
          }
          @media (max-width: 743px) {
            font-size: 14px;
            text-align: left;
          }
        `}
      >
        The Global Fund is a partnership designed to accelerate the end of AIDS,
        tuberculosis and malaria as epidemics. As an international organization,{" "}
        the Global Fund mobilizes and invests more than US$4 billion a year to
        support programs run by local experts in more than 100 countries.{" "}
      </p>
    </div>
  );
}
