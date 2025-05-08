import React from "react";
import GFLogo from "app/modules/home-module/assets/gf-logo.png";
import MFALogo from "app/modules/home-module/assets/mfa-finland-logo.png";
import IatiLogo from "app/modules/home-module/assets/iati-logo.png";
export default function OurPartnersBlock() {
  return (
    <div>
      <h4
        css={`
          font-size: 18px;
          line-height: 29px;
          text-align: center;
          margin: 0;
          padding: 0;
          @media (max-width: 1024px) {
            font-size: 16px;
            line-height: 19px;
          }
        `}
      >
        <b>Partners</b>
      </h4>
      <div
        css={`
          display: flex;
          justify-content: center;
          align-items: center;
          padding-top: 8px;
          gap: 200px;
          img {
            width: 127px;
            height: 78px;
            object-fit: contain;
          }
          @media (max-width: 1024px) {
            gap: 85px;
          }
          @media (max-width: 600px) {
            gap: 42.5px;
            padding-top: 56px;
            border-bottom: none;
            img {
              width: 66px;
            }
          }
        `}
      >
        <img src={MFALogo} alt="mfa-finland-logo" />

        <img src={GFLogo} alt="globalfund_logo" />

        <img src={IatiLogo} alt="iati-logo" />
      </div>
    </div>
  );
}
