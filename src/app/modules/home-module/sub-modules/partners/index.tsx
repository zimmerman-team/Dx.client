import React from "react";
import Tab from "@material-ui/core/Tab";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";

import Container from "@material-ui/core/Container";
import withStyles from "@material-ui/core/styles/withStyles";
import HomeFooter from "app/modules/home-module/components/Footer";
import DXBlock from "app/modules/home-module/sub-modules/partners/components/useDXBlock";
import QuoteBlock from "app/modules/home-module/sub-modules/partners/components/quoteBlock";
import OurPartnersBlock from "app/modules/home-module/sub-modules/partners/components/ourPartnersBlock";

import { useTitle } from "react-use";
import Hero from "app/modules/home-module/components/hero";
import { useAuth0 } from "@auth0/auth0-react";
import { Box } from "@material-ui/core";
import { PrimaryButton } from "app/components/Styled/button";
import { Link } from "react-router-dom";
import SignInButtons from "app/modules/home-module/components/SignInButtons";
import InlineLogo from "app/modules/home-module/assets/inline-logo";
import TryUsBlock from "app/modules/home-module/components/TryUsBlock";
import {
  DESKTOP_BREAKPOINT,
  FOCUS_VISIBLE_STYLE_LIGHT,
  MOBILE_BREAKPOINT,
} from "app/theme";
import { css } from "styled-components/macro";
import PartnerCarousel from "./components/partnerCarousel/partnerCarousel";

export const ctaLinkStyle = (label: string) => css`
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  border-radius: 12px;
  background: #6061e5;
  color: #fff;
  width: max-content;
  height: 48px;
  outline: none;
  border: none;
  font-family: "GothamNarrow-Bold", sans-serif;
  padding: 0 24px;
  font-size: 14px;
  text-transform: capitalize;
  white-space: nowrap;
  cursor: pointer;

  :disabled {
    background: #dfe3e6;
    pointer-events: none;
    color: #70777e;
  }
  :focus-visible {
    ${FOCUS_VISIBLE_STYLE_LIGHT}
  }
  @media (max-width: ${MOBILE_BREAKPOINT}) {
    width: ${label === "contact" ? " 106px" : "175px"};
    height: 35px;
    padding: 12px 12px;
    @media (max-width: 425px) {
      width: 100%;
    }
  }
`;
export default function PartnersModule() {
  useTitle("Dataxplorer - Partners");

  const { isAuthenticated } = useAuth0();

  return (
    <>
      <div
        css={`
          display: flex;
          justify-content: space-between;
          flex-direction: column;
          margin-top: 50px;
          min-height: calc(100vh - 50px);
          background: #ffffff;
        `}
      >
        <div>
          <Hero title="Our Partners">
            {isAuthenticated ? (
              <div>
                <p>
                  Collaboration is at the heart of everything we do — meet the
                  partners driving change with us.
                </p>
                <Box height={"40px"} />
                <Box
                  display={"flex"}
                  gridColumnGap={{ xs: "8px", sm: "24px" }}
                  gridRowGap={"8px"}
                  justifyContent={"center"}
                  flexDirection={"row"}
                  alignItems={"center"}
                >
                  <Link
                    to="/"
                    data-cy="empower-block-explore-stories-link"
                    css={ctaLinkStyle("dashboard")}
                  >
                    Go to the Dashboard
                  </Link>
                  <Link to="/contact" css={ctaLinkStyle("contact")}>
                    Contact Us
                  </Link>
                </Box>
              </div>
            ) : (
              <div>
                <p>
                  Collaboration is at the heart of everything we do — meet the
                  partners driving change with us.
                  <br />
                  Sign in to get the most out of Dataxplorer and keep things
                  connected.
                </p>
                <Box height={"40px"} />
                <SignInButtons />
              </div>
            )}
          </Hero>
          <OurPartnersBlock />
          <main aria-label="partners-main-section">
            <Container
              maxWidth="lg"
              css={`
                padding: 80px 24px;
                @media (max-width: ${DESKTOP_BREAKPOINT}) {
                  padding: 60px 32px !important;
                }

                @media (max-width: ${MOBILE_BREAKPOINT}) {
                  padding: 50px 24px !important;
                }
              `}
            >
              <Grid
                container
                justifyContent="center"
                alignItems="center"
                direction="column"
                css={`
                  width: 100%;
                  gap: 40px;
                `}
              >
                <DXBlock />
                <PartnerCarousel />
                <QuoteBlock />
              </Grid>
            </Container>
            <div
              css={`
                background: #f2f7fd;
              `}
            >
              {" "}
              <Container
                maxWidth="lg"
                css={`
                  padding: 80px 24px;
                  @media (max-width: ${DESKTOP_BREAKPOINT}) {
                    padding: 60px 32px !important;
                  }

                  @media (max-width: ${MOBILE_BREAKPOINT}) {
                    padding: 50px 24px !important;
                  }
                `}
              >
                <TryUsBlock
                  title="Give Dataxplorer a try, on us"
                  subtitle="Dataxplorer turns data into impact in minutes"
                  signInWith
                />
              </Container>
            </div>
          </main>
        </div>
        <HomeFooter />
      </div>
    </>
  );
}
