import React from "react";
import GFLogo from "app/modules/home-module/assets/gf-logo.png";
import MFALogo from "app/modules/home-module/assets/mfa-finland-logo.png";
import IatiLogo from "app/modules/home-module/assets/iati-logo.png";
export default function OurPartnersBlock() {
  return (
    <div
      css={`
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 17px 0;
        border-bottom: 1px solid #e4e4e4;
        gap: 80px;
        img {
          width: 189px;
          height: 78px;
          object-fit: contain;
        }
        @media (max-width: 1024px) {
          gap: 30px;
        }
        @media (max-width: 818px) {
          flex-direction: column;
          gap: 2px;
          padding-top: 56px;
          border-bottom: none;
        }
      `}
    >
      <h4
        css={`
          font-size: 24px;
          line-height: 29px;
          margin: 0;
          padding: 0;
          @media (max-width: 1024px) {
            font-size: 16px;
            line-height: 19px;
          }
        `}
      >
        <b>Our partners</b>
      </h4>

      <img src={GFLogo} alt="globalfund_logo" />

      <img src={MFALogo} alt="mfa-finland-logo" />

      <img src={IatiLogo} alt="iati-logo" />
    </div>
  );
}
