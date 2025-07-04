import React from "react";
import HeroEllipses from "app/modules/home-module/assets/hero-ellipses.png";
import HeroEllipsesTablet from "app/modules/home-module/assets/hero-ellipses-tablet.svg";
import HeroEllipsesMobile from "app/modules/home-module/assets/hero-ellipses-mobile.svg";
import { Box, Container } from "@material-ui/core";
import {
  DESKTOP_BREAKPOINT,
  MOBILE_BREAKPOINT,
  TABLET_STARTPOINT,
} from "app/theme";

interface HeroProps {
  title?: React.ReactNode;
  children?: React.ReactNode;
}

export default function Hero({ title, children }: HeroProps) {
  return (
    <div
      css={`
        position: relative;
        background: url(${HeroEllipses}),
          linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #f2f7fd 100%);
        background-color: #f2f7fd;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: 58px 0%;
        @media (max-width: ${DESKTOP_BREAKPOINT}) {
          background: url(${HeroEllipsesTablet}),
            linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #f2f7fd 100%);
          background-repeat: no-repeat;
          background-size: cover;
          background-position: bottom right;
        }
        @media (max-width: ${MOBILE_BREAKPOINT}) {
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
            @media (max-width: ${DESKTOP_BREAKPOINT}) {
            }
            ) {
              font-size: 64px;
            }

            @media (max-width: ${MOBILE_BREAKPOINT}) {
              font-size: 48px;
            }
          }

          > p {
            color: #231d2c;
            font-family: "GothamNarrow-Bold", sans-serif;
            font-size: 24px;
            font-style: normal;
            text-align: center;
            margin: 0;
            line-height: normal;
            @media (max-width: ${DESKTOP_BREAKPOINT}) {
            }
            ) {
              font-size: 18px;
              line-height: normal;
            }
          }
        }
      `}
    >
      <Container
        maxWidth="lg"
        css={`
          padding-top: 100px;
          padding-bottom: 80px;

          @media (min-width: ${TABLET_STARTPOINT}) {
            @media (max-width: ${DESKTOP_BREAKPOINT}) {
              padding: 100px 32px 80px 32px;
            }
          }
          @media (max-width: ${MOBILE_BREAKPOINT}) {
            padding: 100px 16px 40px 16px;
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
          <h1>{title}</h1>
          <Box height={"40px"} />
          {children}
        </div>
      </Container>
    </div>
  );
}
