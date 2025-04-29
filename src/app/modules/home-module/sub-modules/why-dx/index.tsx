import React from "react";
import Container from "@material-ui/core/Container";
import HomeFooter from "app/modules/home-module/components/Footer";
import EllipsesDesktop from "app/modules/home-module/assets/whydx-ellipses.svg";
import EllipsesTablet from "app/modules/home-module/assets/whydx-ellipses-tablet.svg";
import EllipsesMobile from "app/modules/home-module/assets/whydx-ellipses-mobile.svg";
import TryUsBlock from "app/modules/home-module/sub-modules/why-dx/components/tryUsBlock";
import EmpowerBlock from "app/modules/home-module/sub-modules/partners/components/empowerBlock";
import KeyFeaturesBlock from "app/modules/home-module/sub-modules/why-dx/components/keyFeaturesBlock";
import { useTitle } from "react-use";
import { useMediaQuery } from "usehooks-ts";
import Hero from "app/modules/home-module/components/hero";
import { useAuth0 } from "@auth0/auth0-react";
import { Box } from "@material-ui/core";
import AddAssetDropdown from "app/modules/home-module/components/AddAssetDropdown";
import { Link } from "react-router-dom";
import { PrimaryButton } from "app/components/Styled/button";
import SignInButtons from "app/modules/home-module/components/SignInButtons";

export default function WhyDX() {
  useTitle("Dataxplorer - Why Dataxplorer?");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const isMobile = useMediaQuery("(max-width: 641px)");
  let Ellipses = EllipsesDesktop;
  if (isTablet) {
    Ellipses = EllipsesTablet;
  } else if (isMobile) {
    Ellipses = EllipsesMobile;
  }
  const { isAuthenticated } = useAuth0();

  return (
    <>
      <div
        css={`
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin-top: 50px;
          min-height: calc(100vh - 50px);
        `}
      >
        <div>
          <Hero
            title={
              <>
                Create high impact data driven{" "}
                <b
                  css={`
                    background: linear-gradient(90deg, #231d2c, #6061e5);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                  `}
                >
                  stories
                </b>
              </>
            }
          >
            {isAuthenticated ? (
              <Box
                display={"flex"}
                gridColumnGap={"24px"}
                gridRowGap={"8px"}
                justifyContent={"center"}
                flexDirection={{ xs: "column", sm: "row" }}
                alignItems={"center"}
              >
                <AddAssetDropdown />
                <Link
                  to="/"
                  data-cy="empower-block-explore-stories-link"
                  css={`
                    text-decoration: none;
                  `}
                >
                  <PrimaryButton
                    css={`
                      height: 48px;
                      @media (max-width: 600px) {
                        width: max-content;
                      }
                    `}
                    size="big"
                    bg="light"
                    type="button"
                  >
                    Explore the Dashboard
                  </PrimaryButton>
                </Link>
              </Box>
            ) : (
              <div>
                <p>Sign in for free to unlock data visualisation tools with</p>
                <Box height={"10px"} />
                <SignInButtons />
              </div>
            )}
          </Hero>
          <div
            css={`
              background-color: #f2f7fd;
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
              <KeyFeaturesBlock />
              <div
                css={`
                  height: 120px;
                  @media (max-width: 1024px) {
                    height: 72px;
                  }
                `}
              />
              <TryUsBlock
                title="Try Dataxplorer for free"
                subtitle="Dataxplorer turns data into impact"
                contactUs
                bestDecisions
              />
              <div
                css={`
                  height: 100px;
                  @media (max-width: 1024px) {
                    height: 40px;
                  }
                `}
              />
            </Container>
          </div>
        </div>
        <HomeFooter />
      </div>
    </>
  );
}
