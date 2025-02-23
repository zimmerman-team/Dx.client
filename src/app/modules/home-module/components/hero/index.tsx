import React from "react";
import { ReactComponent as GoogleIcon } from "app/modules/onboarding-module/asset/google-img.svg";
import { ReactComponent as LinkedInIcon } from "app/modules/onboarding-module/asset/linkedIn-img.svg";
import { ReactComponent as MicrosoftIcon } from "app/modules/onboarding-module/asset/microsoft-img.svg";
import HeroEllipses from "app/modules/home-module/assets/hero-ellipses.svg";
import HeroEllipsesTablet from "app/modules/home-module/assets/hero-ellipses-tablet.svg";
import HeroEllipsesMobile from "app/modules/home-module/assets/hero-ellipses-mobile.svg";

import { socialAuth } from "app/utils/socialAuth";
import { Box, Container } from "@material-ui/core";

export default function Hero() {
  return (
    <div
      css={`
        position: relative;
        background: url(${HeroEllipses}),
          linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #f2f7fd 100%);
        background-color: #f2f7fd;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: bottom;
        @media (max-width: 960px) {
          background: url(${HeroEllipsesTablet}),
            linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #f2f7fd 100%);
          background-repeat: no-repeat;
          background-size: cover;
          background-position: bottom right;
        }
        @media (max-width: 744px) {
          background: url(${HeroEllipsesMobile}),
            linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #f2f7fd 100%);
          background-repeat: no-repeat;
          background-size: cover;
          background-position: bottom right;
        }

        div {
          > h1 {
            color: #231d2c;
            text-align: center;
            font-family: "GothamNarrow-Bold", sans-serif;
            font-size: 96px;
            text-transform: capitalize;
            line-height: normal;
            margin: 0px;
            b {
              background: linear-gradient(90deg, #231d2c, #6061e5);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            @media (max-width: 960px) {
              font-size: 64px;
            }
            @media (max-width: 744px) {
              font-size: 48px;
            }
          }

          > p {
            color: #231d2c;
            font-family: "GothamNarrow-Bold", sans-serif;
            font-size: 36px;
            font-style: normal;
            text-align: center;
            margin: 40px 0 10px 0;
            line-height: 43px;
            @media (max-width: 960px) {
              font-size: 18px;
            }
            @media (max-width: 744px) {
              line-height: normal;
            }
          }
        }
        button {
          gap: 8px;
          color: #231d2c;
          display: flex;
          padding: 12px 24px !important;
          height: 48px;
          border-radius: 12px;
          outline: none;
          border: none;
          background: #a1a2ff;
          align-items: center;
          justify-content: center;
          font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
          white-space: nowrap;
          font-size: 16px;
          > svg {
            transform: scale(0.8);
          }
          :hover {
            opacity: 0.8;
            cursor: pointer;
          }
        }
      `}
    >
      <Container
        maxWidth="lg"
        css={`
          padding-top: 100px;
          padding-bottom: 80px;
          @media (max-width: 960px) {
            padding: 100px 32px 80px 32px;
          }
          @media (max-width: 744px) {
            padding: 80px 16px 40px 16px;
          }
        `}
      >
        <div
          css={`
            display: flex;
            flex-direction: column;
            justify-content: center;
          `}
        >
          <h1>
            Create high impact data driven <b>stories</b>
          </h1>
          <Box>
            <p>Sign in for free to unlock data visualisation tools with</p>
            <Box
              display={"flex"}
              gridColumnGap={"16px"}
              gridRowGap={"8px"}
              justifyContent={"center"}
              flexDirection={{ xs: "column", sm: "row" }}
            >
              <button onClick={() => socialAuth("google-oauth2")}>
                <GoogleIcon /> Google
              </button>
              <button onClick={() => socialAuth("linkedin")}>
                <LinkedInIcon /> LinkedIn
              </button>
              <button onClick={() => socialAuth("windowslive")}>
                <MicrosoftIcon /> Microsoft
              </button>
            </Box>
          </Box>
        </div>
      </Container>
    </div>
  );
}
