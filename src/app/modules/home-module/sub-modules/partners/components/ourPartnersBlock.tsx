import React from "react";
import { ReactComponent as GFLogo } from "app/modules/home-module/assets/gf-logo.svg";
import { ReactComponent as MFALogo } from "app/modules/home-module/assets/mfa-finland-logo.svg";
import IatiLogo from "app/modules/home-module/assets/iati-logo.png";
import { Container } from "@material-ui/core";
export default function OurPartnersBlock() {
  return (
    <div
      css={`
        background: #f2f7fd;
      `}
    >
      <Container
        maxWidth="lg"
        css={`
          @media (max-width: 1024px) {
            padding: 0 32px !important;
          }

          @media (max-width: 600px) {
            padding: 0 24px !important;
          }
        `}
      >
        <div
          css={`
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 80px 0;
            width: 100%;
            gap: 173px;
            img {
              width: 208.548px;
              object-fit: contain;
            }
            @media (max-width: 1439px) {
              padding: 60px 0;
              gap: 66px;
              img {
                width: 168.896px;
              }
            }
            @media (max-width: 743px) {
              padding: 50px 0;
              flex-direction: column;
              gap: 20px;
            }
          `}
        >
          <MFALogo />

          <GFLogo />

          <img src={IatiLogo} alt="iati-logo" />
        </div>
      </Container>
    </div>
  );
}
